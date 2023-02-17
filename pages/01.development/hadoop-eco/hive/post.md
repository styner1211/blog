# Hive

- HDFS에 있는 데이터를 쿼리하기 위한 엔진
- 하둡을 통해서 데이터를 쿼리하려면 MapReduce Job을 만들어야 하는데, Hive는 SQL을 통해 필요한 MapReduce Job으로 변환 시켜줌
  - Hive를 실행하는 엔진으로 Spark를 쓸 수 있음
- Hive 메타스토어를 통해, 연결되어 있는 데이터베이스의 메타 데이터를 가지고 있음
  - Spark가 위 메타 데이터를 그대로 이용하여 SQL 작업을 처리할 수 있음
