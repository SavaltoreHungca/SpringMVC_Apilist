package com.zhgt.watercommon.apilist.server;


import com.zxslsoft.general.apilist.ApiCommentDao;
import com.zxslsoft.general.apilist.CommentDao;
import com.zxslsoft.general.apilist.FileUtils;
import com.zxslsoft.general.apilist.Utils;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;

import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLDecoder;


@SpringBootApplication
@ServletComponentScan
@EnableScheduling
@EnableAsync
@RestController
public class ApilistServer {

    CommentDao commentDao = new ApiCommentDao();

    public static void main(String[] args) throws Exception {
        new SpringApplicationBuilder(ApilistServer.class).web(WebApplicationType.SERVLET).run(args);
    }


    @PostMapping("/updateFromJson")
    public void updateFromJson(HttpServletRequest request) throws Exception {
        String json = Utils.getString(FileUtils.getBytes(request.getInputStream()));
        if (!Utils.isEmptyString(json)) {
            commentDao.updateFromJson(json);
        }
    }

    @GetMapping("/exportDb")
    public void exportDb(HttpServletResponse resp) throws Exception {
        byte[] data = commentDao.exportDb();

        resp.setHeader("Content-Type", "application/octet-stream");
        resp.setHeader("accept-ranges", "bytes");
        resp.setHeader("content-length", data.length + "");
        resp.setHeader("content-disposition", "attachment;filename=db.json");

        resp.getOutputStream().write(data);
    }

    @GetMapping("/update")
    public void update(String key, String value) {
        commentDao.update(decode(key), decode(value));
    }

    @GetMapping("/query")
    public String query(String key) {
        return commentDao.query(decode(key));
    }

    private String decode(String str){
        try{
            return URLDecoder.decode(str, "UTF-8");
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}