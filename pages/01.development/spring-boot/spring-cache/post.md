# Spring Cache

## @Cacheable 어노테이션의 잘못된 활용의 예

```java
@Service
public class CacheService{

	@Cacheable(value = "cacheTest", key = "{#root.methodName}")
	public int cacheableMethod() {
		System.out.println("CacheableMethod() >> Make a calculation for result");
		int result = 0;
		for(int i = 0; i < 3; i++) {
			System.out.println("processing...");
			result ++;
		}
		return result;
	}

	public int selfInvocaionMethod() {
		System.out.println("SelfInvocaionMethod() >> return this cacheableMethod() ");
		return cacheableMethod();
	}
}
```

위와 같은 방식으로 @Cacheable을 이용하여 로컬 캐시를 작성했다면, 의도한 것 처럼 캐시가 정상적으로 활용하지 못하고, 계속해서 관련 함수(`cachedableMethod())를 계속해서 호출하게 된다.

이것은 동일 클래스(Bean)내에서 @Cacheable 어노테이션이 적용된 메서드를 자기 호출(Self-invocation)할 경우 Proxy Class에서 이미 캐싱된 결과를 가져오지 못하고 메서드를 다시 실행하게 되기 때문이다.

프록시 객체가 해당 메서드 앞뒤에 부가적인 기능(횡단 관심사)를 실행한 후 기존 객체의 메서드를 호출하게 되는 매커니즘으로 동작하게 되는데, 이때 이미 기존객체로 들어와서 거기서 내부 호출이 발생하는 부분에 대해서는 프록시 객체를 거치지 않게 된다.
결과적으로 Self-Invocation 으로 호출된 메서드는 AOP 가 정상적으로 적용되지 않는 것이다.

> Spring AOP(Aspect-Oriented Programming)는 인터페이스 구현 여부에 따라서 JDK Dynamic Proxy 와 CGLIB를 사용해 AOP 를 적용한다. (Spring Boot 에서는 기본적으로 모든 상황에서 CGLIB 을 사용한다)
