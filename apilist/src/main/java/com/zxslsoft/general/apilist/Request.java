package com.zxslsoft.general.apilist;

import com.zxslsoft.general.apilist.FileUtils;
import com.zxslsoft.general.apilist.Utils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.util.Map;

public class Request {

    private RestTemplate restTemplate;
    private String baseAddr = "";

    public Request() {
        this.restTemplate = new RestTemplate();
    }

    public Request(String baseAddr) {
        this.restTemplate = new RestTemplate();
        this.baseAddr = baseAddr;
    }

    public Request(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Request(RestTemplate restTemplate, String baseAddr) {
        this.restTemplate = restTemplate;
        this.baseAddr = baseAddr;
    }

    private String getUri(String uri, Map<String, String> uriVariables) {
        try {
            String params = "?";
            for (String key : uriVariables.keySet()) {
                params += URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(uriVariables.get(key), "UTF-8") + "&";
            }
            if (Utils.isEmpty(uriVariables)) {
                return uri;
            }
            return uri + params;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String get(String url) throws RestClientException {
        return restTemplate.getForObject(FileUtils.join(baseAddr, url), String.class);
    }

    public String get(String url, Map<String, String> uriVariables) throws RestClientException {
        return restTemplate.getForObject(FileUtils.join(baseAddr, getUri(url, uriVariables)), String.class);
    }

    public <T> T get(String url, Class<T> responseType, Map<String, String> uriVariables) throws RestClientException {
        return restTemplate.getForObject(FileUtils.join(baseAddr, getUri(url, uriVariables)), responseType);
    }

    public <T> T get(String url, Class<T> responseType) throws RestClientException {
        return restTemplate.getForObject(FileUtils.join(baseAddr, url), responseType);
    }

    public <T> T postForm(String url, Class<T> responseType, LinkedMultiValueMap<String, Object> map) throws RestClientException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(map, headers);

        return restTemplate.postForObject(FileUtils.join(baseAddr, url), request, responseType);
    }

    public <T> T postJson(String url, Class<T> responseType, Object requestObject) throws RestClientException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Object> entity = new HttpEntity<>(requestObject, headers);
        return restTemplate.postForObject(FileUtils.join(baseAddr, url), entity, responseType);
    }
}
