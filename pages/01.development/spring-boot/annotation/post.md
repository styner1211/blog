# 스프링부트 어노테이션

## `application.yml` 파일 일기

`@SpringBootTest`없이 프로퍼티 파일을 읽기 위해서는 다음 설정이 필요하다. 해당 어노테이션을 추가한 후에 `@Value`를 통한 속성 값 할당이 가능하다.

### Kotlin
```java
@ContextConfiguration(
    initializers = [ ConfigDataApplicationContextInitializer::class ]
)
```