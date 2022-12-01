package com.zxslsoft.general.apilist;

import org.reflections.Reflections;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpSession;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.*;

public class ApiListSpringResolve {

    private final List<String> basePackages;

    private static final List<Class<? extends Annotation>> CONTROLLER_ANOTAION_CLASS_LIST =
            Arrays.asList(RestController.class, Controller.class);
    private static final List<Class<?>> ESSENTIAL_TYPE =
            Utils.asList(String.class, Integer.class, Long.class, Double.class, Float.class,
                    Integer[].class, String[].class, Long[].class, Double[].class, Float[].class);

//    public static final SerializerFeature[] JSON_FEATURES = new SerializerFeature[]{
//            //    输出key是包含双引号
//            SerializerFeature.QuoteFieldNames,
//            //    是否输出为null的字段,若为null 则显示该字段
//            SerializerFeature.WriteMapNullValue,
//            //    数值字段如果为null，则输出为0
//            SerializerFeature.WriteNullNumberAsZero,
//            //     List字段如果为null,输出为[],而非null
//            SerializerFeature.WriteNullListAsEmpty,
//            //    字符类型字段如果为null,输出为"",而非null
//            SerializerFeature.WriteNullStringAsEmpty,
//            //    Boolean字段如果为null,输出为false,而非null
//            SerializerFeature.WriteNullBooleanAsFalse,
//            //    Date的日期转换器
//            SerializerFeature.WriteDateUseDateFormat,
//            //    循环引用
//            SerializerFeature.DisableCircularReferenceDetect,
//            SerializerFeature.PrettyFormat
//    };

    public  ApiListSpringResolve(List<String> basePackages){
        this.basePackages = basePackages;
    }

    private Set<Class<?>> getControllers(String basePackage) {
        Reflections reflections = new Reflections(basePackage);
        Set<Class<?>> annotated = new HashSet<>();

        for (Class<? extends Annotation> i : CONTROLLER_ANOTAION_CLASS_LIST) {
            annotated.addAll(Utils.nullSafe(reflections.getTypesAnnotatedWith(i)));
        }
        annotated.remove(ApiListSpringResolve.class);

        return annotated;
    }

    private String fixPath(String path) {
        if (path == null) {
            return "";
        }
        if (!path.startsWith("/")) {
            return "/" + path;
        }
        return path;
    }

    private Map<String, ApiInfo> getEndPoint(Class<?> controlClass) {
        // 获取根路径
        String basePath = null;
        for (Class<? extends Annotation> i : Arrays.asList(RequestMapping.class, Controller.class, RestController.class)) {
            Object v = ReflectUtils.getAnnotationValueOfClass(i, controlClass, "value");
            if(v instanceof String[]){
                basePath = Utils.getOne((String[]) v);
            }else if(v instanceof String) {
                basePath = (String) v;
            }
            if (!Utils.isEmptyString(basePath)) break;
        }

        if (basePath == null) basePath = "";
        if(!"".equals(basePath)) basePath = fixPath(basePath);

        Map<String, ApiInfo> ans = new HashMap<>();

        // 获取单个controller的每个接口
        for (Method i : Utils.asList(controlClass.getDeclaredMethods())) {

            String uri = null;
            String requestType = null;

            if (i.isAnnotationPresent(RequestMapping.class)) {
                RequestMapping mapping = i.getDeclaredAnnotation(RequestMapping.class);

                if (!Utils.isEmpty(mapping.value())) {
                    uri = basePath + fixPath(mapping.value()[0]);
                } else if (!Utils.isEmpty(mapping.path())) {
                    uri = basePath + fixPath(mapping.path()[0]);
                } else {
                    uri = basePath;
                }

                if (!Utils.isEmpty(mapping.method())) {
                    requestType = mapping.method()[0].name();
                } else {
                    requestType = "ANY";
                }

            } else if (i.isAnnotationPresent(PostMapping.class)) {
                PostMapping mapping = i.getDeclaredAnnotation(PostMapping.class);
                if (!Utils.isEmpty(mapping.value())) {
                    uri = basePath + fixPath(mapping.value()[0]);
                } else if (!Utils.isEmpty(mapping.path())) {
                    uri = basePath + fixPath(mapping.path()[0]);
                } else {
                    uri = basePath;
                }
                requestType = "POST";
            } else if (i.isAnnotationPresent(GetMapping.class)) {
                GetMapping mapping = i.getDeclaredAnnotation(GetMapping.class);
                if (!Utils.isEmpty(mapping.value())) {
                    uri = basePath + fixPath(mapping.value()[0]);
                } else if (!Utils.isEmpty(mapping.path())) {
                    uri = basePath + fixPath(mapping.path()[0]);
                } else {
                    uri = basePath;
                }
                requestType = "GET";
            }

            if (Utils.isEmptyString(uri)) continue;

            if (String.class.equals(i.getReturnType()) && !i.isAnnotationPresent(ResponseBody.class)&& !controlClass.isAnnotationPresent(RestController.class)){
                continue;
            }

            ApiInfo apiInfo = new ApiInfo();

            apiInfo.setRequestType(requestType);
            apiInfo.setReturnType(i.getReturnType().getSimpleName());
            apiInfo.setFormRequest(getFormRequest(i));
            apiInfo.setJsonRequest(getJsonRequests(i));
            apiInfo.setPackagePath(controlClass.getPackage().getName());
            apiInfo.setUri(uri);
            apiInfo.setClassName(controlClass.getName());
            apiInfo.setClassSimpleName(controlClass.getSimpleName());

            ans.put(uri, apiInfo);
        }
        return ans;
    }

    private String getJsonRequests(Method method) {
        List<Parameter> parameters = Utils.asList(method.getParameters());
        String ans = null;
        for (Parameter i : parameters) {
            if (i.isAnnotationPresent(RequestBody.class)) {
                try {
                    ans = ReflectUtils.classToJson(i.getType());
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
                break;
            }
        }
        return ans;
    }

    private Collection<FieldInfo> getFormRequest(Method method) {
        List<Parameter> parameters = Utils.asList(method.getParameters());

        Collection<FieldInfo> ans = new ArrayList<>();

        for (Parameter i : parameters) {
            if (Utils.isEmpty(i.getAnnotations()) || i.isAnnotationPresent(RequestParam.class)) {
                if (Utils.in(i.getType(), ESSENTIAL_TYPE)
                        || Collection.class.isAssignableFrom(i.getType())
                ) {
                    FieldInfo fieldInfo = new FieldInfo();
                    fieldInfo.name = i.getName();
                    fieldInfo.type = i.getType().getSimpleName();

                    ans.add(fieldInfo);
                }else if(Enum.class.isAssignableFrom(i.getType())){
                    FieldInfo fieldInfo = new FieldInfo();
                    fieldInfo.name = i.getName();
                    fieldInfo.type = i.getType().getSimpleName();

                    ans.add(fieldInfo);
                } else if (!ServletRequest.class.isAssignableFrom(i.getType())
                        && !ServletResponse.class.isAssignableFrom(i.getType())
                        && !HttpSession.class.isAssignableFrom(i.getType())
                        && !MultipartFile.class.isAssignableFrom(i.getType())
                        && !MultipartFile[].class.isAssignableFrom(i.getType())
                ) {
                    for (Field field : ReflectUtils.getFields(i.getType(), true)) {
                        FieldInfo fieldInfo = new FieldInfo();
                        fieldInfo.name = field.getName();
                        fieldInfo.type = field.getType().getSimpleName();
                        ans.add(fieldInfo);
                    }
                }
            }
        }

        return ans;
    }


    // 获取接口
    public Map<String, ApiInfo> getEndpoints() {
        Map<String, ApiInfo> ans = new HashMap<>();

        List<Class<?>> contorllers = new ArrayList<>();
        for (String i : this.basePackages) {
            contorllers.addAll(getControllers(i));
        }

        for (Class<?> i : contorllers) {
            ans.putAll(getEndPoint(i));
        }
        return ans;
    }
}
