package com.zxslsoft.general.apilist;

import com.alibaba.fastjson.JSONArray;
import com.zxslsoft.general.apilist.Utils;

import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("all")
public class JsonUtils {

    public static Map<String, Object> parse(String jsonText) {
        return JSONArray.parseObject(jsonText, Map.class);
    }

    public static Map<String, String> parseToStr(String jsonText) {
        Map<String, Object> map = parse(jsonText);
        Map<String, String> ans = new HashMap<>();
        Utils.nullSafe(map).forEach((k, v) -> {
            ans.put(k, v == null ? null : v.toString());
        });
        return ans;
    }

    public static String stringify(Object obj){
        return JSONArray.toJSONString(obj);
    }
}
