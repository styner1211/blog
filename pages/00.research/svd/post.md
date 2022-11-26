# Singular Value Decomposition (SVD)

> Singular Value Decomposition (이하 SVD)는 Eigendecomposition의 일반화된 형태이므로 먼저 Eigendecompositon에 대해 정리해 본다.

## 1. Eigendecomposition (고유값 분해)

Eigendecomposition은 이름부터 뭔가 Eigenvector / Eigenvalue와 관련이 있을 것 같으니, 이 둘에 대해서 잠시 떠올려 보자.

### 1.1. Eigenvector($$v$$: 고유벡터) / Eigenvalue($$\lambda$$: 고유값)

$$
Av = {\lambda}v
$$

n x n square matrix(정방 행렬) $$A$$에 non-zero vecotr $$v$$를 곱했을 때의 결과가, $$\lambda$$와 vector $$v$$의 곱과 같을 때, 이때 v를 eigenvector, 그리고 이에 대응되는 $$\lambda$$를 eigenvalue라 한다.

> 어떤 정방 행렬 A를 eigenvector와 곱해도 eigenvector는 방향이 변하지 않고 scale만 $$\lambda$$만큼 변한다.

$$
\begin{aligned}
Av - {\lambda}v &= 0
\\
(A - \lambda E)v &= 0
\end{aligned}
$$

이때, 위에서 v는 0이 아니라 했는데, 만약 $$A - {\lambda}E$$의 역행렬이 존재한다면, $$v$$는 항상 0이 되므로, non-zero eigenvector가 존재하기 위해서는 아래 식을 만족해야 한다.

$$
det(A-\lambda E) = 0
$$

이것을 행렬 $$A$$의 특성 방정식이라 부른다. 이것을 만족하는 $$\lambda$$를 구하는 것이 eigenvalue를 구하는 것이고, 이렇게 구한 $$\lambda$$를 $$(A - \lambda E)v = 0$$에 대입하여 계산하면 eigenvector를 구할 수 있다.

> 어떤 행렬에 대해 고유값은 유일하게 결정되지만, 고유벡터는 유일하지 않다. (보통 크기를 1로 정규화한 벡터를 고유벡터로 사용한다)

### 1.2 대칭 행렬(symmetric matrix)과 고유값 분해

> 실수를 원소로 가지는 모든 대칭 행렬은 항상 고유값 분해가 가능하고, 이때 고유 벡터들은 서로 직교한다. (Spectral Therom)

$$
\begin{aligned}
A &= Q \Lambda Q^{\intercal}
\\
AQ &= Q \Lambda
\end{aligned}
$$

<figcaption align="center">
  <b>식1: eigendecomposition</b>
</figcaption>

위 theorem에 따라 대칭 행렬 $$A$$는 위 식 1과 같이 서로 직교하는 (orthogonal) 고유 벡터 $$Q$$를 갖는다.

이것이 가장 중요한 성질이라고 볼 수 있는데, 고유값 분해(eigendecomposition)에 의해 얻은 고유 벡터 고유 벡터 $$Q$$가 어떤 새로운 차원에서의 축(axis)로서 기능을 할 수 있다는 것을 의미한다.
이해를 돕기 위해 (심혈을 기울여서) 그림을 그려 보자면 다음과 같다. (위 식 1과 비교해 보면서 생각해보자.)

<img width="600" src="/assets/research/svd/axis.JPG" />
<figcaption align="center">
  <b>그림1: eigenvector의 역할</b>
</figcaption>

즉, 고유값 분해로 구한, 고유 벡터로 이루어진 행렬을 $$Q$$의 각 열이 고유 벡터 $$v^1$$, 고유 벡터$$v^2$$인데, 앞서 설명한 therem에 따라 각 벡터는 서로 orthgonal하기 때문에, 새로운 기저 공간에서의 축(axis)으로 역할을 할 수 있는 것이다. (위 그림 1에서 빨간색 축)

그리고 행렬 $$A$$에 있던 정보(좌표)들은 새로운 공간에서는 아래와 같은 좌표에 위치하는 생각 할 수 있다.

$$
(a^1, a^2) \to (|a_1||v^1|cos\theta, |a_2||v^2|cos\theta)
$$

지금까지 설명한 eigendecomposition에 대해 어느 정도 이해했다면, 이어질 Singular Value Decomposition에 대한 부분은 사실 다 이해한 것이나 다름 없다.

## 2. Singular Value Decomposition (특이값 분해)

> 특이값 분해는 고유값 분해의 좀 더 일반화된 개념이다.

앞서 고유값 분해는 반드시 정방 행렬이어야만 했다. 하지만 특이값 분해는 정방 행렬일 필요 없이 m x n 행렬 $$A$$를 다음과 같이 표현 한다.

$$
A = UDV^{\intercal}
$$

<figcaption align="center">
  <b>식2: singular value decomposition</b>
</figcaption>

그리고 다음은 같은 Singular Vector Decomposition의 중요한 성질이 있다.

- $$A$$는 m x n matrix (정방행렬 아님)
- $$U$$는 m x m orthogonal matrix 이고, $$AA^{\intercal}$$의 eigenvector로 이루어진 행렬이고, 이것이 singular vector 라는 것
- $$D$$는 m x n matrix 이고, $$A^{\intercal}A$$의 eigenvalue의 제곱근으로 이루어진 대각 행렬이고, 이것이 singular value 라는 것
- $$V$$는 n x m orthogonal matrix 이고, $$A^{\intercal}A$$의 eigenvector로 이루어진 행렬이고, 이것이 singular vector라는 것

이것은 다음과 같은 식을 통해 위 성질이 타당하다라는 결론을 얻을 수 있다.

왜냐하면 임의의 행렬 $$A$$가 정방행렬이 아니더라도 $$AA^{\intercal}$$ 혹은 $$A^{\intercal}A$$는 정방 행렬이 되고 앞서 설명한 것처럼 고유 벡터를 가지게 된다.
또한 orthgonal matrix는, 자신을 transpose 시키면 자신의 역행렬이 되는 성질을 가지고 있고, 각 행벡터 혹은 각 열벡터가 서로 orthogonal 하기 때문에 위와 같은 설명이 가능해 진다.

<img width="600" src="/assets/research/svd/svd.JPG" />
<figcaption align="center">
  <b>그림2: Singular Vector Decomposition</b>
</figcaption>

> 특이값 분해에서는 특이값(singular value)의 크기에 따라 상위 N개와 대응하는 차원만을 활용하여 저차원 벡터로 임베딩 하는 효과를 누리게 된다

특이값 분해는 위 그림의 $$A$$ 행렬을 어떻게 정의하느냐에 활용도가 무궁무진하다.

생각나는 것 몇가지만 적어보자면,

- 정보 검색에서는 $$A$$를 Term X Document 행렬로 보고 $$U$$의 각 행과 $$V$$의 각 열을 Term Vector 또는 Document Vector로 활용하여 문서의 유사도 측정에 활용
- 문서 요약에서는 $$A$$를 Term X Document 행렬로 보고 $$V$$에서 나타난 Sentence Embedding의 요소 값과 대응하는 singular vector를 활용하여 문장에서 나타나는 특정 Concept의 중요도를 반영하여 문장의 중요도를 측정
- 추천 시스템에서는 $$A$$를 User X Item 행렬로 이루어진 Rating 값으로 보고 특정 User가 관심이 있을 법한 Item을 선정 한다던지, 특정 Item이 타게팅 하면 좋을 User를 선별 한다던지에 활용
