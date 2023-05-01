
# VMware Fustion 윈도우 11 설치

애플 실리콘 맥(M1 또는 M2)에서 VMware Fusion을 이용하여 Windows 11 InsiderPreview를 설치할 때, 아래와 같이 VMware 상에서 네트워크 연결이 안되서 윈도우 11 설치를 진행할 수 없는 상태가 발생한다.

> 다음 사진에서 보이는 것 처럼 `I don't have internet` 버튼을 생겨나도록 하고 설치를 진행할 수 있는 위한 방법을 설명한다. 
<img width="600" src="/assets/development/env/windows-arm/network-pending.png" />

위 화면에서 `Shift` + `F10`을 눌러 cmd 프롬프트를 실행해서 다음의 명령어를 순서대로 입력한다.

```sh
cd oobe
bypassnro.cmd
```

그럼 자동으로 재시작이 되고 설치가 처음부터 진행되는데, 그 이후 부터는 위 그림 처럼 `I don't have internet` 버튼이 활성화 되어 설치를 진행할 수 있다.

설치가 완료되면 VMware Fustion 어플리케이션의 Virtual Machine 메뉴에서, Install VMware Tools 를 클릭하면,
윈도우의 파일 탐색기에서 D:₩ 에서 VMware Tools가 마운트 된 것을 확인할 수 있다.

PowerShell을 관리자 모드로 실행하여, 아래 명령어를 순서대로 입력하자.

```sh
D:\
Set-ExecutionPolicy RemoteSigned
.\setup.ps1
```

그럼 재부팅 후, 디스플레이와 네트워크가 정상적으로 설정된 것을 확인할 수 있다.

