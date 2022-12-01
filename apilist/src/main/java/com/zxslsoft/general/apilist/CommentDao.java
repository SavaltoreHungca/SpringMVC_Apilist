package com.zxslsoft.general.apilist;

public interface CommentDao {
    void updateFromJson(String json);

    byte[] exportDb();

    void update(String key, String value);

    String query(String key);

}
