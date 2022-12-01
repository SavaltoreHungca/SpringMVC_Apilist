package com.zxslsoft.general.apilist;

import com.alibaba.fastjson.JSONArray;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@SuppressWarnings("all")
public class ApiCommentDao implements CommentDao{

    private final String dbFilePath;
    private final Lock lock = new ReentrantLock(true);

    private final Map<String, String> cache = new ConcurrentHashMap<>();

    public ApiCommentDao(){
        try {
            String userHome = System.getProperty("user.home");
            String separator = System.getProperty("file.separator");
            String apilistdir = userHome + separator + ".apilist";
            String dbFile = "apilist-db.json";
            dbFilePath = apilistdir + separator + dbFile;
            if (!new File(apilistdir).exists()) {
                FileUtils.mkdirs(apilistdir);
                FileUtils.touch(dbFilePath);
            } else if(FileUtils.exists(dbFilePath)) {
                byte[] bytes = FileUtils.getFileBytes(dbFilePath);
                try{
                    cache.putAll(JSONArray.parseObject(Utils.getString(bytes), Map.class));
                }catch (Exception e){
                    //pass
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void updateFromJson(String json){
        cache.putAll(JSONArray.parseObject(json, Map.class));
        serializeCache();
    }

    public byte[] exportDb(){
        return FileUtils.getFileBytes(dbFilePath);
    }

    public void update(String key, String value){
        lock.lock();
        try {
            cache.put(key, value);
            serializeCache();
        }finally {
            lock.unlock();
        }
    }

    public String query(String key){
        lock.lock();
        try {
            return cache.get(key);
        }finally {
            lock.unlock();
        }
    }


    private void serializeCache() {
        lock.lock();
        try{
            String json = JSONArray.toJSONString(cache);
            FileUtils.saveFile(json.getBytes(StandardCharsets.UTF_8), dbFilePath);
        }finally {
            lock.unlock();
        }
    }

}
