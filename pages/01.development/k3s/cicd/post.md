# CI/CD 파이프라인

> Git Repository와 Jenkins를 연동시켜 소스코드를 빌드하고 쿠버네티스에 배포하는 파이프라인을 만들어 보자.

## Jenkins 환경 설정

### Jenkins 플러그인 설치

Dashboard > Jenkins 관리 > 플러그인 관리 > `Available plugins`

`Kubernetes`, `GitLab`, `Docker Commons` 를 다운로드 및 설치하고 재시작 한다.

### Kubernetes 설정

Dashboard > Jenkins 관리 > 노드 관리 > `Configure Clouds`

### `Kubernetes Cloud details`

`Disable https certificate key` 항목에 체크

### `Credentials`

`Add` 드랍 다운 버튼에서 - `Jenkins` 선택 후, 

`Kind`에서 `Kubernetes Service Account` 선택 하고 `Add` 버튼 클릭한다.

다시, 이전 화면으로 돌아와서 `Credential`을 `Secret Text`로 선택한 후 Test Connection을 클릭한다.

연결이 정상적으로 되었으면 Save 한다.

### 연결 테스트

`Test Connection` 버튼을 눌러 연결에 이상이 없음을 확인한다.

### 테스트 파이프라인 생성 및 실행

Jenkin 메인 화면에서 `새로운 Item`을 선택한다.

item name을 기입하고(ex.`test-project`), `Pipeline`을 선택 후 `OK` 버튼을 눌러 다음으로 넘어간다.

Pipeline에서 `Pipeline script`로 다음을 입력하고 저장하자.

```
podTemplate(label: 'builder',
            containers: [
                containerTemplate(name: 'gradle', image: 'gradle:8.0.2-jdk8', command: 'cat', ttyEnabled: true),
            ]) {
    node('builder') {
        stage('Build') {
            container('gradle') {
                sh "echo pipeline test"
            }
        }
    }
}
```

저장 된 프로젝트를 `지금 빌드` 해보자!
이상이 없다면, Build History에 Success 이럭이 남을 것이고, 쿠버네티스에서도 정상적으로 Pod가 실행되고 사라지는 것을 확인할 수 있을 것 이다.


## Git Repository 연동


### 인증서 복사
/etc/docker/certs.d/[도메인:포트]/ca.crt



### RBAC

젠킨스에서 쿠버네티스의 자원에 접근이 필요할 경우 권한이 필요하다.(젠킨스가 쿠버네티스 안에서 설치된거지만 권한 필요.)예로 젠킨스 안에서 kubectl을 설치한 후에 kubectl을 사용해서 자원(pod이라던가.)을 가져오거나 service의 scale을 컨트롤 하는 코드가 있는 경우에 해당한다. 
권한이 없는 경우 이런식으로 에러메시지가 뜬다. 

```
+ kubectl get ns test
Error from server (Forbidden): namespaces "test" is forbidden: User "system:serviceaccount:jenkins:default" cannot get resource "namespaces" in API group "" in the namespace 
```

```sh
kubectl create clusterrolebinding permissive-binding --clusterrole=cluster-admin --user=admin --user=kubelet --group=system:serviceaccounts:jenkins
```



#### 쿠버네티스 노드에 인증서 복사

Jenkins에서 빌드 성공 이후, 쿠버네티스에서 Harbor의 도커 이미지를 pull 하는 과정에서 아래와 같은 오류 메시지가 나타날 수 있다.

```
Failed to pull image "[HARBOR_HOST]:[HARBOR_PORT]/test/demo:latest": rpc error: code = Unknown desc = failed to pull and unpack image "[HARBOR_HOST]:[HARBOR_PORT]/test/demo:latest": failed to resolve reference "203504.iptime.org:30001/test/demo:latest": failed to do request: Head "https://[HARBOR_HOST]:[HARBOR_PORT]/v2/test/demo/manifests/latest": x509: certificate signed by unknown authority
```

이때 필요한 것은 Harbor의 해당 프로젝트의 Registry Certificate(`ca.crt`)를 다운 받아서, 쿠버네티스 모든 노드에서 다음 명령어로 인증서를 복사한 뒤 인증서 업데이트가 필요하다.

```sh
$ sudo cp ca.crt /usr/local/share/ca-certificates/[HARBOR_HOST]:[HARBOR_PORT]
$ sudo update-ca-certificates
$ sudo systemctl restart k3s
```

