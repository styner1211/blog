# 인그레스: Ingress

> 인그레스는 외부 사용자가 쿠버네티스 클러스터에서 실행중인 서비스에 접근하기 위한 방법을 제어하는 라우팅 규칙 모음이다.

<img width="600" src="/assets/development/k3s/ingress/ingress.png" />

Ingress는 임의의 포트 또는 프로토콜을 노출시키지 않는다. 
보통은 Service.Type=NordPort, Service.Type=LoadBalancer 유형의 서비스와 함께 사용한다.

## NodePort

NodePort는 그 이름에서 알 수 있듯이, 클러스터를 구성하는 Node와 애플리케이션 Port로 직접 접근하는 것으로 가장 원시적인(primitive)한 방법이다.

<img width="600" src="/assets/development/k3s/ingress/nodeport.png" />

```
apiversion: v1
kind: Service
metadata:
  name: my-nodeport-service
  spec:
    selector:
      app: my-app
        type: NodePort
          ports:
          - name: http
            port: 80
            targetPort: 80
            nodePort: 30036
            protocol: TCP
```

## Load Balancer

LoadBalancer 서비스 타입은 외부 로드밸런서를 이용하는 방식이다. 외부 로드밸런서는 NginX, AWS ALB(Application Load Balancer), Kong, Traefik 무엇이든 상관없다.

<img width="600" src="/assets/development/k3s/ingress/loadbalancer.png" />

이 로드밸런서에는 공인 IP주소가 할당되고 외부 트래픽을 클러스터의 쿠버네티스 서비스로 라우팅한다. 요즘 클라우드에 쿠버네티스 클러스터를 전개하는 경우가 많아지고 있는데, 대부분의 클라우드 서비스 제공자는 자사에서 제공하는 로드밸런스 서비스를 쿠버네티스에 통합 할 수 있게 제공한다. 클라우스 서비스를 이용하고 있다면, 클라우스 서비스 제공자가 제공하는 로드밸런서를 이용하는게 확장성/안정성 측면에서 유리하다.

## Ingress

쿠버네티스는 호스트 혹은 URL을 기반으로 작동하는 Ingress를 제공한다. Ingress는 Ingress controller를 이용해서 Nginx, Kong, Traefik와 같은 타사 프록시를 제어하는 방식으로 구현되어 있다.

Ingress 컨트롤러는 쿠버네티스 클러스터 레벨에서 작동하는 프락시로 쿠버네티스와 매우 밀접하게 통합되어 있다. 쿠버네티스 클러스터 관리자는 목적에 맡는 프록시를 이용해서 클러스터내에서의 로드밸런싱을 구축할 수 있다. 쿠버네티스 ingress는 쿠버네티스 클래스터 레벨에서 작동하므로 여전히 외부 로드밸런서가 필요 할 수 으며, 보통 외부 로드밸런서와 함께 구축 한다. 아래 그림은 쿠버네티스 ingress를 묘사하고 있다.

<img width="600" src="/assets/development/k3s/ingress/ingress_detail.png" />

Ingress(NginX, Istio 등으로 구성된)로 HTTP 요청이 들어오면, 이 요청은 각 프록시 설정에 따라서 서비스로 라우팅된다.
