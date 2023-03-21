# Multipass

multipass는 Canonical에서 배포하는 VM 설치 도구로서 CLI 단 몇 줄 만으로 정말 빠르게 VM을 배포 할수 있게 해주며
Mac 뿐만 아니라 Windows도 지원한다.

Linux 환경에서는 KVM, Windows에서는 Hyper-v, MacOS에선 HyperKit을 사용하여 VM을 생성, 관리하게 된다.

## Mac OS에서 Multipass 설치

```sh
brew install --cask multipass
```

##

```sh
multipass launch --name k3s-master1 --cpus 2 --memory 8G --disk 120G
```

## Multipass 사용법

### 우분투 인스턴스 생성

```sh
multipass launch
```

사용 할 버전을 명시해줄 수도 있다.

```
multipass launch 20.04
```

아래와 같은 옵션 값을 통해 인스턴스의 스펙을 조절해줄 수 있다.

```
multipass launch --cpus <cpus> --disk <disk> --mem <mem> --name <name>
```

- -c, --cpus <cpus>: 할당할 CPU의 개수 (최소값 : 1, 기본값 : 1)
- -d, --disk <disk>: 할당할 저장공간 (기본적으로 byte 단위이며, K, M, G 접미사를 붙여서 단위를 지정할 수 있다.)
- -m, --mem <mem>: 할당할 메모리 (기본적으로 byte 단위이며, K, M, G 접미사를 붙여서 단위를 지정할 수 있다.)
- -n, --name <name>: 인스턴스의 이름을 지정해준다.

### 인스턴스 목록 조회

```sh
multipass list
```

### 인스턴스 Shell 접속

```sh
multipass shell <instance name>
```

### 명령 실행

-- 하이픈 두개 뒤에 리눅스에서 사용 할 명령어를 입력한다.

```sh
multipass exec <instance name> -- <명령어>
```

### 인스턴스 정지

stop 명령어를 통해 인스턴스를 정지시킬 수 있다. 정지된 인스턴스는 State가 Stopped가 된다.

```sh
multipass stop <instance name>
```

### 인스턴스 시작

start 명령어를 통해 정지되어 있던(Stopped 상태) 인스턴스를 실행시킬 수 있다.

```sh
multipass start <instance name>
```

### 인스턴스 삭제

delete 명령어를 통해 인스턴스를 삭제할 수 있다. 해당 명령어를 통해 인스턴스를 삭제할 경우, 완전히 없어지는 것이 아니다. ls 명령을 통해 인스턴스 목록을 조회할 시, State가 deleted인 상태로 남아있다.

```sh
multipass delete <instance name>
```

### 인스턴스 복구

recover 명령어를 통해 deleted 상태인 인스턴스를 복구할 수 있다. 복구된 인스턴스는 Stopped 상태가 된다.

```sh
multipass recover <instance name>
```

### 인스턴스 영구 삭제

```sh
multipass purge
```
