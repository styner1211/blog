# 자바의 비동기 기술

### Future
비동기 작업 수행의 결과를 나타냄

es.execute()
Runnable 인터페이스를 구현: 파라미터도 없고 리턴값도 없다.

Future<T> f = es.submit()
- Callable 인터페이스를 구현: 리턴할 수있음, 예외도 발생시킬 수 있음
- f.get() 비동기 작업의 결과를 가져옴
- f.get()은 blocking: 비동기 작업을 기다려야함




## 비동기 작업의 결과를 가져오는 방법

### Runnable
Runnable
다음은 Runnable 인터페이스 코드입니다. 인자를 받지 않고 리턴값이 없습니다.

public interface Runnable {
    public abstract void run();
}


### Callable
Callable
다음은 Callable 인터페이스 코드입니다. 인자를 받지 않으며, 특정 타입의 객체를 리턴합니다. 또한 call() 메소드 수행 중 Exception을 발생시킬 수 있습니다.

public interface Callable<V> {
    V call() throws Exception;
}



### 스프링에서의 비동기 코드 구현


#### ListenableFuture


이벤트 드리븐
터치, 스크롤, 여러가지 이벤트를 대응하는 목적

여러 서버에서 메시지 같은것들이 날라오는데 이런거를 처리하는 방식
데이터가 계속 흘러오는 방식 (스트림 스타일) -> 플럭스

디비에서 컬렉션을 걸고 한번에 받아오는것
api 호출해서 결과를 한번에 받아오는것 -> 모노





스프링 @Async를 사용할때는 Future, ListenableFuture, CompletableFuture로 결과를 담는다




토비 8번째, 1:20분정도
@Bean
ThreadPoolTaskExecutor tp() {
    ThreadPoolTaskExecutor te = new ThreadPoolTaskExecutor();
    te.setCorePoolSize(10);
    te.setQueueCapacity(200);
    te.setMaxPoolSize(100);
    te.setThreadNamePrefix("mythred");
    te.initialize();
    return te;
}

@Async 사용할때 위에 처럼 @Bean을 등록해서 쓰는게 좋음 (안그러면 스레드 생성될 때마다 계속 만듦)
@Async(value="tp") <---- 스레드 풀을 개별적으로 사용할 때,



@GetMapping("/callable")
public Callable<String> callable() throw InterruptedExcetpion {
    log.info("callable");
    return () -> { // 작업 스레드에서 수행
        log.info("aync");
        Thread.sleep(2000);
        return "hello";
    };
}

Callabe
- MVC 메소드의 리턴타입
- 비동기 작업을 수행하고 결과를 MVC 메소드의 결과처럼 처리해준다. 
- 요청을 받으면 서블릿은 바로 해당 요청에 대한 스레드를 반환하고, 해당 요청에 대한 작업은 백단의 워커스레드에서 돌아간다




토피 8 2시간 15분쯤


DefferedResult
- 채팅방에서 메시지 날릴 때

Queue<DefferedResult<String>> results = new ConcurrentLinkedQueue<>();

@GetMapping("/dr")
public DefferedResult<String> callable() throw InterruptedExcetpion {
    log.info("dr");
    DefferedResult<String> dr = new DefferedResult(60000); // timeout 설정
    reust.add(dr);
    return dr; //0. 먼저 서블릿에는 반환이 되고, 응답은 대기상테에 걸림, 2. 메시지가 전달 된다.
}

@GetMapping("/dr/count")
public String drcount() {}
    return String.valueOf(resut.size());
}

@GetMapping("/dr/event")
public String drEvent(String msg) {}
    for(DefferedResult<String> dr : results) {
        dr.setResult("Hello " + msg); // 1. 이벤트가 발생해야
        results.remove(dr)
    }
    return "OK";
}



# RequestBodyEmitter
데이터를 스트리밍으로 출력함
@GetMapping("/emitter")
public ResponseBodyEmitter emitter() throws IntereuptedException {
    Executors.newSingeThreadExecutor().submit(() -> {
        try {
            for(int i=1; i<=50; i++) {
            emitter.send("<p>Stream " + i + </p>);
            Thread.sleep(100);
        }
        catch (Exception e) {

        }
        
    })
}

톰켓은 서블릿을 사용함
NETTY는 서블릿 기술을 사용하지않음

GET을 실행시킨 클라이언트 톰캣 스레드가 아니라
Mono를 통해 전달되는 작업은, netty의 워커 스레드(논블럭킹 IO를 처리하는 스레드)로 순차적으로 처리를 한다.
그런데 이때, 한 스레드가 오래걸리는 작업이고, 비동기 방식으로 되어있지 않으면,
netty의 워커스레드가 물려있게 되서 전체적인 성능 하락이 일어난다.


Mono.just()
준비가 된 데이터를 사용할 때
이미 다 준비된 퍼블리싱 할 데이터(ㅁㅁㅁ)를 가저다가 퍼블리시 할 준비를 하는것


mono.fromSupplier()
서플라이어: 파라미터만 없고 리턴값만 있는 펑션을 나타내는 펑셔날 인터페이스
컨슈머: 파라미터가 있는거 

HTTP 스트림을 지원하라면 Flux를 이용하는게 편리
