# Spring Boot에서 HTTPS 적용

Self-Signed Certificate 만들기

```sh
keytool -genkey -alias spring -storetype PKCS12 -keyalg RSA -keysize 2048 -keystore keystore.p12 -validity 3650
```


`application.properties` 파일
```sh
server.ssl.key-store=classpath:keystore.p12
server.key-store-stype=PKCS12
server.ssl.key-store-password=abcde12#
server.ssl.key-alias=spring
```

Spring Boot에서 HTTP와 HTTPS 요청을 둘 다 받기위해서 사용한 코드

```java
package app;
import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApplicationServer {
    @Value("${server.port}")
    private int httpSport; // https port
    @Value("${server.port.http}")
    private int httpPort; // http port
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(ApplicationServer.class);
        app.run(args);
    }

    @Bean
    public ServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                SecurityConstraint securityConstraint = new SecurityConstraint();
                securityConstraint.setUserConstraint("CONFIDENTIAL");
                SecurityCollection collection = new SecurityCollection();
                collection.addPattern("/*");
                securityConstraint.addCollection(collection);
                context.addConstraint(securityConstraint);
            }
        };
        tomcat.addAdditionalTomcatConnectors(redirectConnector());
        return tomcat;
    }

    private Connector redirectConnector() {
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setScheme("http");
        connector.setPort(httpPort); // http
        connector.setSecure(false);
        connector.setRedirectPort(port); // https
        return connector;
    }
}

```