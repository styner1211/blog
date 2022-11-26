# 모델 기반 협업 필터링

일단 적어 보자

- Association Rule Mining (연관 규칙)
- Matrix Factorization
    - Singular Value Decomposiiton
    - Alternating Least Square
- Probabilistic Model
- Clustering, Bayes Rules
- SVM
- Regression Model
- 딥러닝 협업필터링
    - Rating Matrix가 Sparse한데, 엄청 큼
    - 압축된 형태로 저장
        - 패턴이 잘 잡혀 있음
- 새로운 추천 가능



- Cold Start 문제
    - 새로 유입된 아이템 혹은 유저에 대한 추천이 어려움
    - 이웃기반 협업 필터링에서는 [유저 - 아이템 매트릭스]에서 평점이 관측되지 않은 경우 추천이 하기 어렵다
    - 딥러닝 기반 추천 알고리즘으로 해결?

- Long-Tail Economy
    - 인기있는 아이템으로 쏠림 현상
    - 모델 기반 협업 필터링으 해결 가능?



- Context Aware Recommend System
    - 기존 RS
        - User x Item -> Rating
    - Context-Aware RS
        - User x Item x Context -> Rating
        - 3차원 텐서로 표현
        - Context
            - 시간
            - 월요일은 주식뉴스 추천
            - 저녁,회식 장소 추천
            - 날씨
            - 등등


- Neural Colaborative Filtering
    - Matrix Factorization은 NCF의 특수한 케이스
    - Linear한 한계를 지적, 복잡하게 표현 가능
        - Embedding Layer
        - User Latent Vector
        - Item Latent V ector

