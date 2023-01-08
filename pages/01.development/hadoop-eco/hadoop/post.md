# 하둡 (Hadoop)

- 데이터의 양과 종류가 많아짐
- RDBMS의 복작하고 상세한 기능이 필요하지 않음
- 데이터 용량이 커지면 단순히 노드를 늘려서 대응 (재설치나 재구성 필요없음)




# Yarn
- 기본 프레임워크인 MapReduce뿐만 아니라, Flink, Spark 같은 분산 처리를 위한 프레임워크나 도구들이 HDFS와 HDFS가 설치된 컴퓨팅 자원을 더 쉽고 효율적으로 이용할 수 있게 함
- HDFS의 Locality를 높여줌, Data가 있는 곳의 Computing 자원을 최대한 활용하도록 함 
- Spark을 보통 Yarn에 띄워서 씀



# HDFS
- Block based file system
  - 어떤 파일이 어느 블록에 저장되어있는지는 메타데이터로 namenode가 메모리에서 관리
  - Disk seek time 감소
  - Metadata size 감소
  - Communication cost between Client and NameNode 감소
- HDFS에 저장되는 모든 파일은 일정 크기의 블록으로 나눠져서 여러서버에 분산되어 저장
  - 기본 128MB
  - 기본 3개의 복제본 유지
  - 기본적으로 복제본은 원본과 다른 rack에 저장됨 (물리적으로 다른 위치)
- HDFS Architecture
  - Namenode
    - metadata 관리
  - Datanode


## Namenode
- Active / Stanby namenode / (Hadoop 3.0 부터는 Observer namenode가 추가됨)
  - 항상 동기화 되어야함
  - 한 순간에 Active namenode는 하나여야 함
- Quorum(과반수, 최소 3개) Journal Nodes를 이용하여 HA Architecture를 구성 할 수 있음 (또는 Shared Storage를 이용, 단 Shared Storage가 HA 구성이 되어있다고 가정)
  - Quorum 노드는 서로 Ring으로 연결되어 있음
  - Active Node가 받은 요청은 Journal Node를 통해 Stanby Node로 전달 됨
  - Active Node가 장애가 나면, Stanby Node는 Journal Node로 부터 최신 상태가 반영 되고, Write 권한까지 받은 이후, Active가 됨
  - Datanode는 Active / Stanby namenode 정보를 모두 알 고 있음