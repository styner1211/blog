# HBase

Hadoop을 기반으로 하는 컬럼형 NoSQL Database

빠른 Write와 Read를 지원하며 HMaster(Master Server)와 Regionserver(Slave Server) 로 구성된다.


Hbase가 데이터를 디스크에 컬럼 지향 형식으로 저장하기는 하지만 전통적인 컬럼식(Columnar) 데이터베이스와는 차이가 있다.

컬럼식 데이터베이스는 데이터에 대한 실시간 분석적 접근 기능을 제공하는데 강점이 있지만 Hbase는 특정 데이터 셀에 키 기반으로 접근 하거나 어떤 범위의 셀에 순차적으로 접근하는데 탁월한 성능을 보인다.

> Hbase는 Key 단위로 정렬시켜 저장하기 때문에 기본적으로 순차 탐색에 유리

<img width="600" src="/assets/development/hadoop-eco/hbase/hbase.jpg" />

## Hbase 쓰기

Hbase에서 데이터를 저장할 때 기본적으로 두 장소에 저장하게 된다.

하나는 WAL(Write Ahead Log), 또 하나는 멤 스토어(Memstore) 이다.

양쪽에 쓰는 이유는 데이터 지속성의 유지 때문이다. 양쪽 모두 두에서 변경이 발생했다는 사실이 확인되면 쓰기 작업은 완료된 것이다.

멤스토어는 디스크에 영구히 쓰기를 하기 전에  HBase 의 메모리에 데이터를 모두 축적하고 있는 쓰기 버퍼이다.

멤스토어의 파일이 가득 차게 되면  HFile 형태로 디스크에 플러시(Flush)를 하며 메모리를 비운다. 

플러시를 할때는 기존의 파일에 추가하는게 아니라 새로운 파일을 만든다.



HFile 은 HBase 저장을 위한 포멧이다. HFile 은 컬럼 패밀리 내에 속하고 컬럼 패밀리는 여러개의 HFile 을 가질 수 있다.

하지만 단일 HFile 은 여러 개의 컬럼 패밀리를 위한 데이터를 가질 수 없다. 

컬럼 패밀리 하다당 하나의 멤스토어만 가진다. 

> write 속도가 간혹 느린 경우가 있는데 이럴때는 컬럼 패밀리를 어떻게 설계 했느냐에 따라서 성능이 달라진다. 동일한 컬럼 패밀리에 적재하는 것 보다 여러개의 컬럼 패밀리로 의미상 나누는 전략도 필요하다.



쓰기 작업이 일어나다가 장애가 발생할 경우 멤스토어의 데이터는 잃어 버리지만 WAL 의 변경사항이 기록된 것을 기준으로 복구한다. 

WAL을 끄게 되면 쓰기 속도는 올라갈 수 있으나 장애 상황시 데이터를 잃게 된다. 


적재 순서를 요약하면, 

Put 요청 -> HRegionServer에 전달 -> HRegion 인스턴스에 요청사항 전달 -> WAL에 데이터 저장(SequenceFile , HLogKey의 인스턴스 저장) -> WAL 기재시 멤스토어에 저장 -> 멤스토어 꽉 찼는지 검사 -> 꽉 찬경우 disk flush -> HFile에 기록 -> 마지막으로 비워진 데이터의 일련번호도 저장하여 WAL 저장 위치 확인 


## WAL이란?

<img width="600" src="/assets/development/hadoop-eco/hbase/wal.png" />

MySQL의 바이너리 로그처럼 데이터 수행이 되는 모든 변경사항을 기록하는 것

서버가 중지되면 WAL을 사용하여 중지되기 직전까지의 상태 변경 사항을 재현할 수 있음. 

WAL에 기록하는데 실패했다면 그 연산은 실패한 것임.



## Hbase 읽기

일반적으로 데이터에 빠르게 접근하고 있다면 메모리에 많이 '유지'하고 '정렬'해서 저장하면 된다. 

Hbase의 읽기는 영속적인 HFile 과 멤스토어에 있는 데이터 사이에 균형을 이루어야 한다.

HBase는 읽기를 위해 LRU(Least Recently Used- 최근에 사용한 것은 메모리에 저장, 가장 활용되지 않은 것은 디스크에 내림) 캐시를 가짐. 이를 블록 캐시(Block Cache)라고 부름

이 캐시는 JVM 힙 메모리 내 멤스토어와 같은 영역에 있음. 블록 캐시는 자주 접속되는 메모리에 있는 HFile 에서 데이터를 유지할 수 있도록 설계되어 있음. 

각 컬럼 패밀리는 자신만의 블록캐시를 가짐

(때문에 모든 컬럼을 한 컬럼 패밀리 안에 유지하는 것이 안 좋을 수 있음)



블록 캐시의 블록은 Hbase가 읽을 수 있는 데이터의 조각임. HFile은 물리적으로 블록들의 Sequence 로 배치된다.  블록상의 인덱스도 같이 배치된다.

블록은 가장 작은 데이터의 인덱스된 단위이고 디스크에서 읽을 수 있는 가장 작은 단위임

블록의 크기는 64KB이지만 컬럼 패밀리별로 변경이 가능하다.  저 작은 블록은 더 큰 인덱스를 만들 수 있고 그렇게 해서 더 많은 메모리를 소비한다. 

> 블록이 작아질 수록 내부에서 관리해야 하는 인덱스량이 늘게 된다. 메모리를 소비하는 만큼 Search 속도는 향상된다.



Hbase에서 로우를 읽을 때 멤스토에에서 먼저 체크 -> 블록캐시는 로우를 가지고 있는 블록이 최근에 접근되었는지 조사 ->  디스크상에 있는 적절한 HFile에 접근하게 된다.

완전한 로우를 읽기 위해서 HBase 는 HFile에게서 데이터를 읽어야 함. 




## 컴팩션

멤스토어를 배우는 과정에서 점차 디스크 상에 저장되는 파일의 개수가 증가하는데, 충분히 늘어나면 컴팩션이 동작하여 파일을 뭉친다.



minor compaction 

최근에 생성된 작은 파일들을 큰 파일로 재작성하는 입무를 수행한다.

설정값 : hbase.hstore.compaction.min 속성

기본 3인데, 2이상으로 설정해야한다. 너무 큰 값을 넣을 경우 minor가 지연되어 나중에 한번에 처리하게 되면 부하가 걸림

최대 값은 10이며 hbase.hstore.compaction.max 속성에 설정

대상 속성을 조정할 수도 있는데,  hbase.hstore.compaction.min.size,   hbase.hstore.compaction.max.size로  max 보다 클 경우 제외되고, min 사이에 들어온 녀석들 만 miner compaction이 일어나게 한다. 만약 범위를 벗어나는 것은 제외된다.  

오래된 파일이 먼저 minor compaction의 대상임



major comopaction

모든 파일을 하나의 파일로 구성함.  어떤 컴팩션이 수행될지는 컴팩션 상태로 자동 결정됨

hbase.hregion.majorcompaction.jitter 속성(기본 0.2로 20%) 은 저장 파일별로 주 컴팩션이 수행되는 시점을 흩어지게 만든다.  만약 없으면 주 컴팩션이 매 24시간 마다 동시에 수행된다.




## 리전탐색


루트 테이블은 메타 테이블에 있는 모든 리전을 참조하는데 사용된다. 

Hbase 설계상 루트 리전은 하나뿐이다.

루트 리전은 B+ 트리와 비슷한 탐색구조를 보장하기 위해 절대로 분할되지 않는다. 



탐색구조의 

1단계는 루트 테이블을 관리하고 있는 리전 위치를 알고 있는 주키퍼에 저장된 노드를 확인하는 것

> zookeeper의 /hbase/root-region-server 테이블에위치를 보고 루트 테이블을 확인

2단계는 루트 테이블에 저장된 메타 리전을 탐색

3단계는 메타테이블에서 사용자 테이블의 리전 위치를 확보한다.



목록 테이블들에 저장된 데이터의 로우 키는 리전이름인데, 테이블이름, 시작키, ID(생성시간 밀리초)를 연결한것에 MD5해쉬 값이 추가된 형태다


클라이언트에서 리전 위치 정보를 캐싱하지만, 오래되거나 변경되면 다시 질의한다. 리전에 먼저 문의하고 이 정보가 틀리면, 루트에 질의하여 메타리전의 위치를 알아낸다.  만약 메타 리전위치도 잘못 되어 있으면 주키퍼 노드를 읽어 루트 테이블 리전 위치를 찾아야 한다.  

최악의 경우 리전 위치를 찾기 위해 6번의 네트워크 반복이 발생한다. 

> 최초에 3번 발생하고 재탐색에 3번 발생한다는 것

캐시에 없을 경우에는 최소 3번의 탐색이 발생함


<img width="600" src="/assets/development/hadoop-eco/hbase/hbase-lookup.png" />


### NoSQL 모델링

Tall-Narrow vs. Flat-Wide Table 구조

Tall-Narrow : 한 row에 컬럼수가 적고 컬럼이 고정되어 있다. Cassandra에서는 Skinny ROW라고 한다.

장점 : * row key로 부분 선별이 가능하다.

   * 대량의 데이터에 더 적합하다.

단점 : * 데이터의 양이 많아질 수 있다. 

   * row 가 많아진다.

Flat-Wide : 한 row에 컬럼수가 많고 row 수가 적다. 다이나믹 컬럼을 많이 사용한다. Cassandra에서는 Wide Row라고 한다.

장점 : * 한 자용자는 한 Row를 갖는다.(즉 한 Row에 많은 column으르 내포하여 의미를 전달한다.)
*모든 컬럼은 Row 별로 정렬되어 저장된다.
     (역자주 : row key 단위 정렬이라는 의미임 다시말해 컬럼 자체도 row key의 순서를 따른다는 말임)

   * 데이터가 한 서버에 집중될 수 있다. (row 단위로 분산되기 때문임)

   * 동일 시간대에 발생한 메시지를 조회하기 어렵다. 


Row key 선택

Row Key 종류

1) Sequential key

<timestamp><more key>:{CF:{CQ:{TS:Val}}}

timestamp를 쓰게 되면 연속쓰기가 되는데, 한 서버에 편양되어 hotspot이 발생한다.

이를 제거하기 위해 salted Key, Promoted Key, Random Key 등으로 region을 분산함. 

sequencial 은 순서대로 검색이 가능하며 범위 검색 시 무척 빠르게 결과값을 가져올 수 있음



2) Salted Key

Prefix_<timestamp><more key>:{CF:{CQ:{TS:Val}}}

인위적으로 region을 분산켜서, 어느정도 hotspot을 방지할 수 있으나, 

범위를 지정할 경우 관련 테이블을 전체를 다 읽어야 한다.



3) Promoted key

<more key><timestamp>:{CF:{CQ:{TS:Val}}}

hotspot을 방지할 수 있으나, timestamp에 의한 구간 검색은 어려움. 

그래도 more_key의 구간검색은 빠름



4) Random Key

<MD5(morekey)><timestamp>:{CF:{CQ:{TS:Val}}}

hotspot을 방지할 수 있으나, 구간 검색은 불가능. 




Row Key 설계

1) 조회 유형(Access patter)에 의한 key 선택

(1) sequencial Key

업무요건 상 조회 유형이 순차적으로 발생하면 sequencial key를 사용

- bulk 데이터 저장시 저장 및 조회 성능을 위해 사용

- 로그정보와 같이 순차적으로 발생한 데이터를 순차적으로 읽어 필요한 통계 데이터를 제공하는 경우에는 Sequencial key를 사용



(2) Random Key

업무요건 상 유형이 임의적으로 발생하면 Random Key

고객번호로 정보를 조회하는 경우에는 고객번호를 MD5로 처리하면 hotspot도 없고 조회시 key 바로 찌르면 나오니까 조회도 빠르다. 