package com.zxslsoft.general.apilist;

import java.util.Collection;

public class ApiInfo {
    public String uri;
    public String className;
    public String classSimpleName;
    public String packagePath;
    public String requestType;
    public String returnType;
    public String jsonRequest;
    public Collection<FieldInfo> formRequest;


    public String getClassSimpleName() {
        return classSimpleName;
    }

    public void setClassSimpleName(String classSimpleName) {
        this.classSimpleName = classSimpleName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getPackagePath() {
        return packagePath;
    }

    public void setPackagePath(String packagePath) {
        this.packagePath = packagePath;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public String getReturnType() {
        return returnType;
    }

    public void setReturnType(String returnType) {
        this.returnType = returnType;
    }

    public String getJsonRequest() {
        return jsonRequest;
    }

    public void setJsonRequest(String jsonRequest) {
        this.jsonRequest = jsonRequest;
    }

    public Collection<FieldInfo> getFormRequest() {
        return formRequest;
    }

    public void setFormRequest(Collection<FieldInfo> formRequest) {
        this.formRequest = formRequest;
    }
}
