# Curve Fitting

몇 가지 중요한 개념을 설명하기에 앞서, 간단한 회귀(Regression) 문제를 소개해 보도록 하겠다.

<img width="400" src="/assets/research/bayesian-inference/curve-fitting/curve-fitting.JPG" />
<figcaption align="center">
  <b>그림 1: Curve Fitting</b>
</figcaption>

위 그림 처럼 10개 점이 데이터로 주어져 있을 때, 이를 잘 설명할 수 있는 곡선을 찾아내는 것을 curve fitting이라고 한다. 그리고 찾아낸 곡선(함수)은 임의의 점 $$x$$에 대한 예측값(함수값)을 제공하는데, 어쩌면 이런 것이 흔히 말하는 기계학습의 가장 간단한 형태가 아닐까 한다.

> 실제로 위 그림은 $$sin(2\pi)$$ 함수에 약간의 noise를 주어서 생성한 데이터이다.

위 그림에 있는 점들을 잘 학습해서 $$sin(2\pi)$$를 알아 낼 수 있다면 좋겠지만, 현실에서는 정답?을 알 수있는 방법은 없고 (찾아낸 것이 정답인지 아닌지도 알 수 없고) 최대한 데이터를 잘 설명할 수 있는 모델을 만드는 것이 목표라고 할 수 있다.

그럼 Curve Fitting은 어떻게 할 수 있을까?

<img width="400" src="/assets/research/bayesian-inference/curve-fitting/error-min.JPG" />
<figcaption align="center">
  <b>그림 2: Error Fuction의 정의</b>
</figcaption>

먼저 데이터에 잘 맞을듯 한 곡선을 표현하기 위해 아래 식처럼 $$M$$차 다항 함수(Polynomial)를 가정(= 모델을 가정)하고 이 함수의 계수(coefficient), $$w_0,...,w_M$$(파라미터)를 잘 찾아내는 문제로 생각 할 수 있다.

$$
y(\mathbf x, \mathbf w) 
=
w_0 + w_1 x + w_2 x^2 + ... + w_M x^M
=
\displaystyle \sum_{j=0}^M w_jx^j
$$

<figcaption align="center">
  <b>식 1: M차 다항함수 모델</b>
</figcaption>

이때, 적절한 계수를 구할 수 있는 가장 일반적인 방법은 실제 데이터(training data)의 y좌표 값과 위 다항함수로 얻을 수 있는 예측값의 차이를 error function을 정의하고
trainng data에 존재하는 모든 data point에 대해 이 error fuction의 값을 최소화 하는 문제로 생각하는 것이다. (아래 식에서 $$\cfrac 1 2$$ 은 나중 계산의 편의성 때문이니 무시하자.)

$$
E(w) = \cfrac 1 2 \displaystyle \sum_{n=1}^N \bigg\{ y(x_n, \mathbf w) - t_n \bigg\}^2
$$

<figcaption align="center">
  <b>식 2: Error Function</b>
</figcaption>

이렇게 위 식 2을 최소화 하는 방법이 최소 제곱법(Least Squares)이라 불리는 방식이고 이것은 Maximum Likelihood Estimation 관점으로 파라미터를 구하는 것과 동일한 것인데 아래에 좀 더 상세한 부분을 설명하도록 하겠다. 


M과 관련해서는 아래 그림 처럼 M에 따라서 under-fitting 또는 over-fitting이 발생하기도 하는데 일단은 이 정도로만 알고 넘어가도 충분할 것 같다.
> M을 달리하는 것은 다른 모델을 선택하는 것으로 생각해야하고, 이것을 model comparison 또느 model selection이라고 부른다.

<img width="400" src="/assets/research/bayesian-inference/curve-fitting/model-selection.JPG" />
<figcaption align="center">
  <b>그림 3: Model Selection</b>
</figcaption>

## 최소제곱법 (Least Squares)
먼저, 최소제곱법 부터 설명해보자면, 입력 변수 $$\mathbf x$$에 대한 비선형 함수 $$\phi_j(\mathbf x)$$의 선형 결합(linear combination)의 형태로 다음과 같이 식 1을 좀 더 일반화 한 형태로 변형할 수 있다.


$$ 
y(\mathbf x, \mathbf w) = \displaystyle \sum_{j=0}^{M-1} w_j \phi_j(\mathbf x) = \mathbf w^{\intercal} \Phi(\mathbf x) 
$$


> $$\phi_j(\mathbf x)$$가 $$x^j$$의 꼴이라면 식 1과 같이 polynomial regression 형태라고 생각하면 된다.



이때 $$\Phi$$ 는 다음과 같이 생각하자

$$
\Phi
=
\begin{pmatrix}
   \phi_0(x_1) & \phi_1(x_1)  & \cdots & \phi_{M-1}(x_1)
   \\
   \phi_0(x_2) & \phi_1(x_2)  & \cdots & \phi_{M-1}(x_2)
   \\
   \vdots & \vdots & \ddots & \vdots
   \\
   \phi_0(x_N) & \phi_1(x_N)  & \cdots & \phi_{M-1}(x_N)
\end{pmatrix}
$$

그럼 위 식 2는 아래와 같이 다시 표현할 수 있다.

$$
E_D(w) = \cfrac 1 2 \displaystyle \sum_{n=1}^N \bigg\{ t_n - \mathbf w^{\intercal} \Phi(\mathbf x) \bigg\}^2
$$

<figcaption align="center">
  <b>식 3: sum-=of-squares error</b>
</figcaption>

여기서 $$w$$로 미분하면,

$$
0 = \displaystyle \sum_{n=1}^N t_n\phi(x_n)^\intercal - \mathbf w^\intercal \bigg ( \displaystyle \sum_{n=1}^N \phi(x_n) \phi (x_n)^\intercal \bigg )
$$

다음과 같이 $$\mathbf w$$의 극소값을 찾을 수 있다.

$$
\mathbf w =  (\Phi^\intercal \Phi)^{-1} \Phi^\intercal \mathbf t
$$




## Probablistic perspective
Curve fitting 문제에서 입력 변수 $$x$$에 대한 예측값 $$t$$를 결정적인(deterministic) 값이 아닌 아래 그림과 같이 확률적인(stochastic) 관점으로 해석할 수 있다. 

<img width="400" src="/assets/research/bayesian-inference/curve-fitting/gaussian-noise.JPG" />
<figcaption align="center">
  <b>그림 3: Probabilistic Perspective</b>
</figcaption>

즉, 예측값 $$t$$는 결정적인 값이 아니라 아래와 같이 어떤 확률 분포로서 표현할 수 있고 여기에서는 다음과 같이 평균이 $$y(x, \mathbf w)$$이고, 분산이 $$\beta^{-1}$$인 가우시안 분포(Gaussian Distribution)로 가정한다.

$$
p(t|x, \mathbf w, \beta) = \mathcal N(t|y(x, \mathbf w), \beta^{-1})
$$



이를 통해 앞서 설명한 최소제곱법에 해당하는 Maximum Likelihood Estimation, 그리고 regularization에 대한 insight를 제공하는 Maximum a Posteriori, 그리고 Bayesian 관점으로 문제를 확장 할 수 있다.

### Maximum Likelihood Estimation (MLE)

입력 데이터 $$X = \{x_1,...,x_N \}$$와 이에 대응하는 목표 값 $$t_1,...t_N$$이 독립적으로 발생했다고 하면 다음과 같은 likelihood funtion을 생각할 수 있다. 


$$
p(\mathbf t | \mathbf X, \mathbf w, \beta) = \displaystyle \prod_{n=1}^N  \mathcal N(t_n|\mathbf w^\intercal \phi(x_n), \beta^{-1})
$$

> 여기서 주목해야하는 관측치는 $$\mathbf t$$이다. $$X$$는 입력 조건에 해당하는 값이기 때문에 drop할 수 있다.

위 식의 극대값을 구하는 것이 목적이므로, 계산 편의를 위해 로그를 취해 정리하면 다음과 같은 식을 얻을 수 있다. (이때, $$E_D(\mathbf w)$$는 위 식 3과 동일하다.)

$$
\begin{aligned}
\ln p(\mathbf t | \mathbf w, \beta)
&=
\displaystyle \sum_{n=1}^N  \mathcal \ln N(t_n|\mathbf w^\intercal \phi(x_n), \beta^{-1})
\\ &=
\cfrac N 2 \ln\beta - \cfrac N 2 \ln(2\pi) - \beta E_D(\mathbf w)
\end{aligned}
$$

MLE 관점에서 파라미터 $$\mathbf w$$를 추정하기 위해서는, 위 식(log-likelihood)을 $$\mathbf w$$대해 미분한 뒤 극대값을 찾으면 되는데, 이것은 $$E_D(\mathbf w)$$가 최소가 되는  $$\mathbf w$$ 값을 찾는 것과 동일한 상황이 된다.

다시말하면, Curve fitting 문제에서 우리가 직관적으로 생각할 수 있는 풀이법인 최소제곱법(Least Squares)은 MLE 방식의 해석으로 볼 수 있다.