# OpenSearch 설치 하기

## prerequisite
```
sudo apt update
sudo apt install build-essential -y
```

## 다운로드 및 압축 풀기
```
# x64
wget https://artifacts.opensearch.org/releases/bundle/opensearch/2.4.1/opensearch-2.4.1-linux-x64.tar.gz
# ARM64
wget https://artifacts.opensearch.org/releases/bundle/opensearch/2.4.1/opensearch-2.4.1-linux-arm64.tar.gz
```

## 
```
# x64
tar -xvf opensearch-2.4.1-linux-x64.tar.gz
# ARM64
tar -xvf opensearch-2.4.1-linux-arm64.tar.gz
```

```
cd opensearch-2.4.1
export OPENSEARCH_HOME=$(pwd)
```

###주요 디렉토리
| 디렉토리 | 설명 |
| :-- | :-- |
| bin  | 실행파일들의 위치 |
|config | 설정 파일의 위치. 부팅하기 전에 설정을 완료해야한다. |
| data | opensearch 가 데이터를 저장하는 위치 |
| jdk | 내장 JDK. Host 에 JDK가 설치되어있지 않으면 사용한다. |
| logs | log 디렉토리 |
| plugins | plugin 의 위치 |

