package com.gdblogs;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy(exposeProxy = true)
@MapperScan("com.gdblogs.mapper")
public class GdblogsApplication {

	public static void main(String[] args) {
		SpringApplication.run(GdblogsApplication.class, args);
	}

}
