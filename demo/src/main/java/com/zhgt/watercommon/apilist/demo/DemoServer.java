package com.zhgt.watercommon.apilist.demo;


import com.zxslsoft.general.apilist.*;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;


@SpringBootApplication
@ServletComponentScan
@EnableScheduling
@EnableAsync
@RestController
public class DemoServer {

    public static void main(String[] args) throws Exception {
        new SpringApplicationBuilder(DemoServer.class).web(WebApplicationType.SERVLET).run(args);
    }


    @GetMapping("/first_api")
    public String firstApi(HttpServletRequest request) throws Exception {
        return "hello";
    }

    @PostMapping("/second_api")
    public Dto sApi(HttpServletRequest request) throws Exception {
        Dto d = new Dto();
        d.setA("A");
        return d;
    }

    @GetMapping("/third_api")
    public String tApi(HttpServletRequest request) throws Exception {
        return "hello";
    }

    @Bean
    public ServletRegistrationBean<HttpServlet> apilist() {
        Map<String, ApiInfo> map = new ApiListSpringResolve(
                Utils.asList("com.zhgt.watercommon.apilist.demo")
        ).getEndpoints();

        ApiManagement apiManagement = new ApiManagement("/apilist", map);

        // 若要使用数据库视图功能，则需要配置视图信息，这里仅支持 mysql
//        MysqlDatabaseResolve databaseResolve =
//                new MysqlDatabaseResolve("localhost",
//                        3306,
//                        "dbname",
//                        "username",
//                        "123456");
//        ApiManagement.regisDbInfo(databaseResolve.getTableInfoMap());

        // 若是将接口描述信息存储在服务器上，则使用此处
        // 使用服务器，可以很方便多人共享接口信息
        apiManagement.setRemoteServer(
                "localhost",
                8888);

        // 将接口描述信息存储在本地
        apiManagement.usingLocalDB();

        return apiManagement.getServletRegistrationBean();
    }
}