# Zookeeper


Zookeeper는 보통 분산 환경에서 Coordiator의 역할을 한다.

## Zookeeper 활용
실제 사용되는 예시로는, HDFS의 HA 클러스터 상에서 automatic failover를 가능하게 하기위해 Apache Zookeepr가 서용된다.

- HDFS의 active / stanby namenode에는 ZookeeperFailoverController (ZKFC)라고 하는 namenode의 상태 모니터링을 하는 zookeepr 클라이언트 프로세스가 존재
- Namenode의 ZKFC는 Quorum으로 구성된 Zookeeper 클러스터에 주기적으로 heartbeat 신호를 보냄
- Active Namenode 장애 시, Stanby Namenode는 Zookeeper 클러스터를 통해 장애를 인지하고, 최신 상태를 반영받아 Active로 선출 됨


## Zookeeper 일반
Zookeeper는 기본적으로 Tree 구조를 구성하는 znode에 데이터를 관리할 수 있다. (Lock 처리가 포함됨)

Leader election을 구현하려면 고려해야할 것이 많다.
- 네트워크가 연결 되었나 / 끊어졌나
- 일시적으로 끊어졌나
- 다시 연결 할건가
- ...

Leader election 전용 namespace를 가지는 znode를 생성하고 CreateMode.EPEHMERAL_SEQUENTIAL을 이용하면 leader election을 간단하게 구현할 수 있다.

