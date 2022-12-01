package com.zxslsoft.general.apilist;

import com.alibaba.fastjson.JSONArray;
import org.springframework.boot.web.servlet.ServletRegistrationBean;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@SuppressWarnings("all")
public class ApiManagement extends HttpServlet {

    private CommentDao commentDao;
    private final String mappingUrl;

    // 静态对象, 存需要加载的接口信息
    private static final Map<String, ApiInfo> apiInfoMap = new HashMap<>();
    private static final Map<String, TableInfo> tableInfoMap = new HashMap<>();

    public static void regisApiInfo(Map<String, ApiInfo> apiMap) {
        apiInfoMap.putAll(apiMap);
    }

    public static void regisDbInfo(Map<String, TableInfo> tableInfoMap) {
        ApiManagement.tableInfoMap.putAll(tableInfoMap);
    }

    public static Map<String, ApiInfo> getApiInfoMap() {
        return apiInfoMap;
    }

    public static Map<String, ApiInfo> getDbInfoMap() {
        return apiInfoMap;
    }

    public ApiManagement(String mappingUrl, Map<String, ApiInfo> apiMap) {
        this.mappingUrl = mappingUrl;
        apiInfoMap.putAll(apiMap);
    }

    public ApiManagement usingLocalDB() {
        this.commentDao = new ApiCommentDao();
        return this;
    }

    public ApiManagement setRemoteServer(String ip, Integer port) {
        this.commentDao = new RemoteCommentDao(ip, port);
        return this;
    }

    public ApiManagement setRemoteServer() {

        String userHome = System.getProperty("user.home");
        String separator = System.getProperty("file.separator");
        String apilistdir = userHome + separator + ".apilist";
        String dbFile = "config.json";

        String dbFilePath = apilistdir + separator + dbFile;

        if (!FileUtils.exists(dbFilePath)) {
            throw new RuntimeException("apilist server 的配置文件未配置, 位于 ~/.apilist/config.json 格式为 {\"ip\": \"127.0.0.1\", \"port\": \"8088\"}");
        }

        try {
            Map<String, String> config = JSONArray.parseObject(Utils.getString(FileUtils.getFileBytes(dbFilePath)), Map.class);
            this.commentDao = new RemoteCommentDao(config.get("ip"), Integer.valueOf(config.get("port")));
        } catch (Exception e) {
            throw new RuntimeException("apilist server 的配置文件有误, 位于 ~/.apilist/config.json 格式为 {\"ip\": \"127.0.0.1\", \"port\": \"8088\"}");
        }

        return this;
    }

    public ServletRegistrationBean<HttpServlet> getServletRegistrationBean() {
        return new ServletRegistrationBean<>(this, FileUtils.join(this.mappingUrl, "/*"));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String uri = getURI(req);
        Map<String, String[]> params = req.getParameterMap();
        if (uri.endsWith("/upfile")) {
            byte[] jsonbytes = FileUtils.getBytes(req.getInputStream());
            commentDao.updateFromJson(Utils.getString(Base64.getDecoder().decode(jsonbytes)));
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String uri = getURI(req);
        Map<String, String[]> params = req.getParameterMap();
        if (uri.endsWith("/exportDB")) {
            byte[] data = commentDao.exportDb();
            resp.setHeader("Content-Type", "application/octet-stream");
            resp.setHeader("accept-ranges", "bytes");
            resp.setHeader("content-length", data.length + "");
            resp.setHeader("content-disposition", "attachment;filename=db.json");
            resp.getOutputStream().write(data);
        } else if (uri.endsWith("/queryComment")) {
            resp.setHeader("Content-Type", "application/json;charset=utf-8");
            String key = params.get("key")[0];

            String value = commentDao.query(key);

            if (key.startsWith("ModuleViewWinInfo:")) {
                String winId = key.replaceFirst("ModuleViewWinInfo:", "");

                String apiUris = commentDao.query("ModuleViewWinUris:" + winId);
                Collection<ApiInfo> apiInfos = new ArrayList<>();
                if (apiUris != null && !Utils.isEmptyString(apiUris)) {
                    List<String> apiUriList = JSONArray.parseArray(apiUris, String.class);
                    for (String s : apiUriList) {
                        if (apiInfoMap.containsKey(s)) {
                            apiInfos.add(apiInfoMap.get(s));
                        }
                    }
                }
                Object position = commentDao.query("ModuleViewWinPosition:" + winId);
                if (position != null && !Utils.isEmptyString((String) position)) {
                    position = JsonUtils.parse((String) position);
                }
                resp.getWriter().write(JSONArray.toJSONString(Utils.asMap(
                        "title", commentDao.query("ModuleViewWinTitle:" + winId),
                        "apiInfos", apiInfos,
                        "position", position
                )));
            } else if (null != value) {
                resp.getWriter().write(value);
            }
        } else if (uri.endsWith("/updateComment")) {
            String key = params.get("key")[0];
            String value = params.get("value")[0];

            if (key.startsWith("deleteWinUri:")) {
                String winId = key.replaceFirst("deleteWinUri:", "");
                String urisJson = commentDao.query("ModuleViewWinUris:" + winId);
                if (urisJson != null && !Utils.isEmptyString(urisJson.trim())) {
                    List<String> uris = JSONArray.parseArray(urisJson, String.class);
                    uris.remove(value);
                    commentDao.update("ModuleViewWinUris:" + winId, JSONArray.toJSONString(uris));
                }
            } else {
                commentDao.update(key, value);
            }
        } else if (uri.endsWith("/getDbInfos")) {
            resp.setHeader("Content-Type", "application/json;charset=utf-8");
            resp.getWriter().write(JSONArray.toJSONString(tableInfoMap));
        } else if (uri.endsWith("/getApiInfoList")) {
            resp.setHeader("Content-Type", "application/json;charset=utf-8");
            String className = params.get("className")[0];
            String path = params.get("path")[0];

            Collection<ApiInfo> apiInfos = new ArrayList<>();

            apiInfoMap.forEach((k, v) -> {
                if (path.equals(v.packagePath) && v.classSimpleName.equals(className)) {
                    apiInfos.add(v);
                }
            });

            resp.getWriter().write(JSONArray.toJSONString(apiInfos));
        } else if (uri.endsWith("/getAllApiInfoList")) {
            resp.setHeader("Content-Type", "application/json;charset=utf-8");
            resp.getWriter().write(JSONArray.toJSONString(apiInfoMap.values()));
        } else if (uri.endsWith("/getPackagePathList")) {
            resp.setHeader("Content-Type", "application/json;charset=utf-8");
            Map<String, Collection<String>> packageClassNames = new HashMap<>();
            apiInfoMap.forEach((k, v) -> {
                packageClassNames.computeIfAbsent(v.packagePath, key -> new HashSet<>())
                        .add(v.classSimpleName);
            });
            resp.getWriter().write(JSONArray.toJSONString(packageClassNames));
        } else if (uri.endsWith("/index.html")) {
            resp.getOutputStream().write(getBytes("/com/zxslsoft/general/apilist/index.html"));
        } else if (uri.endsWith("cfg.js")) {
            resp.setHeader("content-type", "application/javascript;charset=utf-8");
            resp.getWriter().write(
                    "'use strict';\n" +
                            "var SETTINGS = SETTINGS || {};\n" +
                            "SETTINGS = {\n" +
                            String.format("\t'contextRoot' : '%s',\n", req.getContextPath()) +
                            String.format("\t'parentPath' : '%s',\n", FileUtils.join(req.getContextPath(), this.mappingUrl)) +
                            "};"
            );
        } else if (uri.endsWith(".js")) {
            resp.setHeader("content-type", "application/javascript;charset=utf-8");
            resp.getOutputStream().write(getBytes(
                    FileUtils.join("/com/zxslsoft/general/apilist", uri)
            ));
        } else if (uri.endsWith(".map")) {
            //pass
        } else {
            resp.getOutputStream().write(getBytes(
                    FileUtils.join("/com/zxslsoft/general/apilist", uri)
            ));
        }
    }

    private byte[] getBytes(String path) {
        try (
                InputStream inputStream = this.getClass()
                        .getResourceAsStream(path);
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()

        ) {
            byte[] buffer = new byte[1024];
            int len = -1;
            while ((len = inputStream.read(buffer)) != -1) {
                byteArrayOutputStream.write(buffer, 0, len);
            }
            return byteArrayOutputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String getURI(HttpServletRequest req) {
        String url = req.getRequestURI();
        url = url.replaceFirst(req.getContextPath(), "");
        url = url.replaceFirst(this.mappingUrl, "");
        if (!url.startsWith("/")) url = "/" + url;
        return url;
    }
}
