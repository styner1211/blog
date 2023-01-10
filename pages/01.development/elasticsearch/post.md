# 엘라스틱서치 (ElasticSearch)


## 노드 > 인덱스 > 여러개의 샤드 > 여러개의 세그먼트


### 노드
- ***** 하나의 노드에 설정한 힙 1GB 당 20개의 샤드가 적장
- cluster state
  - 클러스터 스테이트는 (마스터 노드를 포함한) 각 노드의 힙에 적재되며, 
  - 힙 사용량은 인덱스와 인덱스/샤드 당 필드 개수에 비례하기 때문이며, 마스터 노드의 힙 사용량을 모니터링하면서 적당한 사이즈로 설정되었는지 확신하는 것이 중요 
  - 빠른 접근을 위해 메모리에 보관
  - 클러스터 내 대량의 인덱스와 샤드는 cluster state를 커지게 함

#### Coordinating node
> Requests like search requests or bulk-indexing requests may involve data held on different data nodes. A search request, for example, is executed in two phases which are coordinated by the node which receives the client request — the coordinating node.
In the scatter phase, the coordinating node forwards the request to the data nodes which hold the data. Each data node executes the request locally and returns its results to the coordinating node. In the gather phase, the coordinating node reduces each data node’s results into a single global result set.
Every node is implicitly a coordinating node. This means that a node that has an explicit empty list of roles via node.roles will only act as a coordinating node, which cannot be disabled. As a result, such a node needs to have enough memory and CPU in order to deal with the gather phase.


### 인덱스
- 인덱스에는 mappings와 state 정보가 있음
  - cluster state에 저장됨
  - 각 노드의 힙에 적재


### 샤드
- 루씬 인덱스
- 50GB를 넘지 않는 것을 권장
- ***** 엘라스틱서치에서는 각 샤드 당 단일 스레드가 각 쿼리를 실행
- 각 샤드에는 메모리에 보관하고 힙 공간을 차지하는 데이터
  - 샤드 레벨의 데이터 구조와 세그먼트 레벨의 디스크 저장 위치와 같은 정보들을 포함
- 각 샤드의 부하는 세그먼트의 수와 크기에 따라 결정
- 많은 개수의 작은 샤드를 조회하면 각 샤드마다 처리 속도는 빨라지지만 더 많은 작업을 큐에 넣고 순서대로 처리해야하므로, 더 적은 개수의 큰 샤드를 검색하는 것보다 반드시 빠르다고 보장할 수 없음. 동시에 여러 쿼리가 실행될 때, 여러 개의 작은 샤드가 오히려 쿼리 처리량(throughput)을 줄일 수도 있음. (결론적으로 1개 샤드의 권장하는 최대 크기를 넘지 않는 선이라면, 작은 크기의 여러 샤드보다는 큰 크기의 적은 샤드가 더 효율적)


#### function_score
- weight
  - filter 조건에 부합할 경우 점수를 weighting
- field_value_factor
  - 문서의 특정 필드 값을 점수에 반영
  - ***** Field Data: 지정한 필드의 모든 값을 메모리에 올려야함
- script
- decay
- random


#### 기타
- Elasticsearch가 실행중일 때 서버 메모리 대부분을 사용하는 것은 정상적임.
- 자바힙으로 설정되지 않은 나머지 메모리는 Elasticsearch가 루씬 파일 캐시 등으로 사용
- 만약 native memory에서 OOM이 발생한다면, 
  - jvm.options에 -XX:MaxDirectMemorySize=<물리 메모리 크기 -Java heap 크기-alpha>을 추가
  - 하지만, 근래의 Elasticsearch는 이미 MaxDirectMemorySize를 자바힙 크기의 절반으로 설정하도록 되어 있음
  - Elasticsearch를 실행하는 서버에 메모리를 많이 사용하는 다른 서비스를 실행하지 않는다면, 굳이 해당 설정을 추가하지 않아도 native memory의 OOM은 발생하지 않음