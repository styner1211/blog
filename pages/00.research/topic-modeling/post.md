# Topic Model

> 토픽 모델이 뭔지 정리해보자

토픽 모델은 자연어 처리, 텍스트 마이닝, 정보 검색, 컴퓨터 비전 등 여러 분야에서 널리 사용되는 확률적 생성 모델이다.

토픽 모델로는 아래와 같이 발전되어 왔다고 볼 수 있다.

- LSI(Latent Sementic Indexing)
- PLSA(Probablility Letent Semantic Analysis),
- LDA(Latent Dirichlet Allocation)
- ...

LSI는 확률 모델이라기 보다는, SVD(Singular Vector Decomposition)과 같은 선형대수적 접근법이고,
PLSA 방법 부터 확률 모델이 적용되었다고 볼 수 있다.
그리고 LDA는 PLSA를 좀더 베이지언 관점에서 모델을 일반화 한 것이라고 생각 할 수 있다.

*물론 그 이후로도 연구가 거듭되어 발전된 여러가지 모델이 있지만,
개인적으로는 LDA가 가장 널리 알려졌다고 생각하기 때문에, 이것을 기본으로 하여 토픽 모델에 대해 정리하려고 한다.*

여기서는 단순히 LDA가 뭐하는건지?를 이야기 하려고 하는 것이 아닌,
이 방법론 자체를 좀 더 깊이있게 이해하기 위해서 나름대로 공부한 내용을 최대한 쉽게 풀어서 설명하려고 한다.
하지만 상당히 방대한 배경 지식이 필요한데, 그 중에서 개인적으로 중요하다고 생각하는 개념은 다음과 같다.

- 몇 가지 확률 분포 및 경우의 수
- Prior, Posterior, Likelihood
- Bayesian Analysis
- Probabilitic Inference
- Graphical Model
- ...
