package com.zxslsoft.general.apilist;

public class RemoteCommentDao implements CommentDao {

    private final Request request;

    public RemoteCommentDao(String ip, Integer port) {
        this.request = new Request("http://" + ip + ":" + port);
    }

    @Override
    public void updateFromJson(String json) {
        try {
            request.postJson("/updateFromJson", Object.class, json);
        } catch (Exception e) {
            // pass
        }
    }

    @Override
    public byte[] exportDb() {
        return request.get("/exportDb", byte[].class);
    }

    @Override
    public void update(String key, String value) {
        try {
            request.get("/update", Object.class, Utils.asMap("key", key, "value", value));
        } catch (Exception e) {
            // pass
        }
    }

    @Override
    public String query(String key) {
        try {
            return request.get("/query", String.class, Utils.asMap("key", key));
        } catch (Exception e) {
            return null;
        }
    }
}
