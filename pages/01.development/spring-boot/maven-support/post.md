# Maven에서 Spring Boot 설정

## Maven multi-module 프로젝트에서 Spring Boot Application을 Maven Dependency로 Import하기

개인적으로 자바 프로젝트를 Maven multi-module 프로젝트로 만들면서 Parent-Child 구조로 사용하는 경우가 많은데,
이때 각 Child 모듈을 Spring Boot 프로젝트로 사용하는 경우가 많았다.

<img width="400" src="/assets/development/spring-boot/maven-support/multi-module.JPG" />
<figcaption align="center">
  <b>그림1: Maven Multi-Module 프로젝트</b>
</figcaption>

문제는 각 child 모듈끼리 의존성을 가져야하는 경우가 있을 때, `pom.xml`에 다른 (Spring Boot 프로젝트로 만들어진) child 모듈을 dependency로 추가하고나서 `mvn install`로 전체 프로젝트를 빌드하려다 보면 아래와 같은 에러 메세지와 함께 빌드 실패를 겪게 된다.

<img width="800" src="/assets/development/spring-boot/maven-support/build-error.JPG" />
<figcaption align="center">
  <b>그림2: cannot find symbol</b>
</figcaption>

> 상황을 좀 더 설명하자면, parent라는 부모 모듈이 있고, 자식 모듈로 child1, child2가 있을 때, 자식모듈은 Spring Boot 프로젝트로 생성되어 있고, child1 프로젝트에 있는 sum이라는 함수를 child2 프로젝트에서 import해서 쓰려고 하는 상황이다.

이것은 보통 Spring Boot Application은 `spring-boot-maven-plugin`이라는 플러그인으로 빌드를 하게 되는데, 프로젝트에서 컴파일 된 JAVA 클래스 뿐 만 아니라 `spring-boot:repackage`라는 goal의 도움으로 Spring Boot Application을 실행하는데 필요한 모든 런타임 라이브러리를 포함하게 된다. 하지만 이렇게 `spring-boot-maven-plugin`에 의해 빌드된 JAR 파일이 Maven이 빌드한 JAR를 말 그대로 repackage했기 때문에 이 JAR 파일을 다른 모듈에서 dependency로 추가해도 기대한 패키지들을 로드할 수 없게 된다.

> 디테일한 메커니즘은 더 정리가 필요

그래서 많은 삽질 끝에 찾아낸 방법은 `maven-jar-plugin`을 이용해서 import 가능한 JAR 파일을 별도로 빌드하는 것이다.

이를 위해서, parent, child1, child2 모듈의 `pom.xml`을 각각 다음과 같이 작성하자. 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>parent</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
    </properties>

    <packaging>pom</packaging>
    <modules>
        <module>child1</module>
        <module>child2</module>
    </modules>

</project>
```
<figcaption align="center">
  <b>parent 모듈의 pom.xml</b>
</figcaption>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.6</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>child1</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>child1</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>11</java.version>
    </properties>

    <packaging>jar</packaging>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.2.0</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                        <phase>package</phase>
                        <configuration>
                            <classifier>app-to-import</classifier>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```
<figcaption align="center">
  <b>child1 모듈의 pom.xml</b>
</figcaption>

위에서 볼 수 있듯이, 기능을 제공하는 쪽인 child1 모듈에서는 `maven-jar-plugin`을 추가적으로 적용하고 `<classifier>`로 `app-to-import`를 붙였다.

이렇게 하고나서 빌드를 하게 되면,

<img width="400" src="/assets/development/spring-boot/maven-support/app-to-import.JPG" />
<figcaption align="center">
  <b>그림3: JAR</b>
</figcaption>

위 그림에서 보이는 것처럼, child1 모듈 내에 생성된 JAR 파일을 3개 볼 수 있는데, 이중에서 `maven-jar-plugin` 플러그인을 통해 빌드된 `child1-0.0.1-SNAPSHOT-app-to-import.jar`파일을 확인 할 수 있다. 이 JAR파일이 child2 모듈에서 의존성으로 추가 된다.


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.6</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>child2</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>child2</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>11</java.version>
    </properties>

    <packaging>jar</packaging>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>child1</artifactId>
            <version>0.0.1-SNAPSHOT</version>
            <scope>compile</scope>
            <classifier>app-to-import</classifier>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

```
<figcaption align="center">
  <b>child2 모듈의 pom.xml</b>
</figcaption>

기능을 제공 받는 child2 모듈에서는 `<dependency>`에서 child1 모듈을 import하게 되는데 이때, `<classifier>`로 `app-to-import`를 붙여서 별도로 생성한 JAR를 통해 의존성을 확보한다.