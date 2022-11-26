# Coin Tossing (동전 던지기)

> 동전을 던졌을 때, 앞면이 나올 확률을 데이터에 기반하여 추정해보자

<img width="180" src="/assets/research/bayesian-inference/coin-tossing/coin-tossing.jpg" />

동전을 던졌을 때, 앞면이 나올 확률은 얼마일까? 우리는 경험적으로 앞면이 나올 확률은 $$\cfrac 1 2$$이라고 알고 있다.

여기서 경험적으로 알고 있다라는 것은 데이터에 기반한 것이다라고 생각할 수 있고, 이것은 분명 많은 관측치(Observation)를 통해서 추정해 낸 것일 것이다. 이러한 활동이 사실 기계 학습(Machine Learning)에서 하는 것과 정확하게 일치한다고 할 수 있다.

다시 본론으로 돌아와서, 다음의 상황을 가정해 보자.

동전 한 개가 주어져 있고, 동전을 던졌을 때, 동전의 앞면이 나올 확률 $$P(H)$$이 얼마일 지 추정해 보고 싶다. 이를 위해서는 먼저 주어져 있는 동전을 여러번 던져보는 시뮬레이션?이 필요하다.

예를 들어 동전을 3번 던져 보고 다음과 같은 결과를 얻었다고 하자. 이때 각 시행은 i.i.d. (independent and identically distributed)라고 가정한다.

$$
\begin{aligned}
H, H, T
\end{aligned}
$$

- $$H$$: 동전 앞면
- $$T$$: 동전 뒷면

위의 관측치들을 토대로, 일반적으로는 동전 앞면이 나올 확률은 $$P(H) = \cfrac 2 3$$ 라고 판단할 수 있다. (물론 동전 던지기 시행 횟수가 3번은 매우 적은 숫자이기는 하다.)

> 위와 같은 해석이 앞으로 설명할 Maximum Likelihood Estimation 방식이라고 할 수 있다.

이것을 좀 더 formal하게 설명 해 본다면,

$$
\begin{aligned}
P(H) &= \mu \\ P(T) &= 1-\mu
\end{aligned}
$$

동전 앞/뒤면이 나올 확률을 각 각 위와 같이 표현할 수 있고, 이때 이 확률 분포는 베르누이 분포(Bernoulli Distribution)를 따른다고 볼 수 있다. 즉, 동전을 던졌을 때 나오는 관측값(ex: $$H, H, T$$) 들은 베르누이 분포로 부터의 샘플이라고 생각할 수 있다.

따라서, 동전 던지기의 반복된 시행으로부터 얻은 데이터 $$D = \lbrace x_1, x_2, ... x_N \rbrace$$, $$x_i=1$$(앞면) 또는 0(뒷면) 라고 할 때,

데이터의 Likelihood는 다음과 같이 계산된다.

$$
\begin{aligned}
P(D|\mu)
=
\displaystyle\prod_{n=1}^{N} p(x_n|\mu)
=
\displaystyle\prod_{n=1}^{N} \mu^{x_n}(1-\mu)^{1-x_n}
\end{aligned}
$$

<figcaption align="center">
  <b>식 1: Likelihood</b>
</figcaption>

위 식을 좀 더 고민해 볼 필요가 있는게, 지금 내가 가지고 있는 "동전"이 얼마나 앞면을 잘 나오게 하는 동전인가에 대한 모델 관점에서 바라본다면,
"동전 모델"을 설명하는 중요한 파라미터는 베르누이 분포의 파라미터인 $$\mu$$라고 할 수 있다.

즉, 기계학습의 관점에서는 주어진 데이터($$D$$)를 통해서 모델의 파라미터인 $$\mu$$를 찾는 것이 목표라고 할 수 있다.

이때, 모델 파라미터를 찾는 접근 방식을 다음의 세가지로 구분 할 수 있는데,

1. Maximum Likelihood Estimation (MLE)
2. Maximum a Posteriori (MAP)
3. Bayesian Inference

하나씩 어떤 특성이 있는지 알아보도록 하겠다.

## Maximum Likelihood Estimation (MLE)

지금 설명하는 MLE 방식은, 대부분의 전통적인 기계학습 모델 뿐만 아니라, 현재 많이 쓰이고 있는 뉴럴 네트워크 모델의 weight 혹은 parameter 값을 구하는데 사용되는 가장 일반적인 방법이다.

위 동전 던지기 상황에서 Maximum Likelihood Estimation 방식으로 파라미터를 추정해 본다면, 말 그대로 위 식 1 likehood를 최대로 하는 $$\mu$$를 찾는 문제가 된다.

$$
\begin{aligned}
\mu_{MLE} = \argmax_{\mu} P(D|\mu)
\end{aligned}
$$

이는 식 1에 로그를 취하고,

$$
\begin{aligned}
\ln P(D|\mu)
=
\displaystyle\sum_{n=1}^{N} \ln \mu + (1-x_n) \ln(1-\mu)
\end{aligned}
$$

$$\mu$$에 대한 미분값이 0인 $$\mu$$값(극대값)을 찾는 방식을 통해 다음과 같이 계산 할 수 있다.

$$
\begin{aligned}
\cfrac d {d\mu} \ln P(D|\mu)
&=
\displaystyle\sum_{n=1}^{N} x_n \cfrac 1 \mu - (1-x_n) \cfrac 1 {1-\mu}

\\ &=
\cfrac 1 \mu h - \cfrac 1 {1-\mu} t = 0

\end{aligned}
$$

따라서, MLE 방식으로 구한 $$\mu$$ 값은 아래와 같다.

$$
\begin{aligned}
\mu_{MLE} = \cfrac h {t+h}
\end{aligned}
$$

결과적으로 MLE 방식으로 앞서 동전 던지기의 상황에 대한 파라미터 $$\mu$$를 추정한다면, 앞면이 나온 횟수 $$h=2$$, 뒷면이 나온 횟수 $$t=1$$ 이기 때문에

$$
\begin{aligned}
P(H) = \mu = \cfrac 2 3
\end{aligned}
$$

이 되고, 이것은 맨 처음 가장 상식적으로? 동전의 앞면이 나올 확률을 예측한 것과 동일한 것을 알 수 있다.

## Maximum a Posteriori (MAP)

위 MLE 방식에는 맹점이 있다. 만약 동전을 여러번 던졌는데 그 결과가 아래와 같다면 어떨까?

$$
\begin{aligned}
T, T, T
\end{aligned}
$$

이런 상황이 발생한다면, MLE 방식으로 동전 앞면이 나올 확률, $$\mu$$를 추정했을때는 0 이 될 것이다.
이는 주어진 데이터의 불완정성으로 인해 모델 학습 과정에서 overfitting을 발생 시킬 소지가 있다는 것이다.

이후 설명 할 MAP, 그리고 Bayesian 방식의 모델 파라미터 추정 방식은 이러한 문제를 방지하면서 좀 더 robust한 모델을 학습 하기 위한 철학이라고 생각하면 된다.

> 사실 데이터가 충분히 많을 경우 위와 같은 문제는 거의 없다고 봐도 되지만, 현실 문제에 있어서 모든 현상을 완벽하게 설명하는 모델을 만들기 어렵고, 데이터 관점에서도 학습을 위해 구축되어 있는 데이터는 실제 우주에 존재하는 모든 관측 가능한 샘플 집합의 극히 일부분임을 감안할 때, 개인적으로는 가능하기만 하다면 Bayesian 방식의 접근법이 합리적이라고 생각한다.

MAP 방식은 MLE 방식에 비해 조금 더 Bayesian스러운 방식이다.

$$\mu$$를 학습하기 위해 다음과 같은 식을 생각해보자.

$$
\begin{aligned}
Posterior &= \cfrac {Likelihood \times Prior} {Evidence}

\\

P(\mu|D)
&=
\cfrac {P(D|\mu)P(\mu)} {P(D)}

\\ &\propto
P(D|\mu)P(\mu)

\end{aligned}
$$

<figcaption align="center">
  <b>식 2: Bayes' Rule</b>
</figcaption>

결론을 먼저 얘기하자면,

MAP는 $$P(\mu|D)$$, 즉 데이터 $$D$$가 주어졌을 때, 가장 그럴듯한 $$\mu$$를 찾는 것을 목표로 하는 것이고, MAP에서는 point estimates, 다시 말하면 $$P(\mu|D)$$의 극대값을 찾는 것을 말한다.

$$
\begin{aligned}
\mu_{MAP} = \argmax_{\mu} P(\mu|D)
\end{aligned}
$$

이때 $$P(\mu|D)$$를 $$\mu$$에 대한 사후 확률 분포(Posterior)라 하고, 이것은 식 2에서 처럼 베이즈 정리에 따라 가능도(Likelihood)와 사전 확률 분포(Prior)의 곱으로 표현할 수 있다.

동전 던지기 상황에서 위 식을 적용한다면,

$$P(D|\mu)$$는 위 식 1 Likehood를, $$P(\mu)$$는 베타 분포(Beta Distribution)를 사용하여 다음과 같이 정리할 수 있다.

> 베르누이 분포의 conjugate prior인 베타분포를 이용하면 계산이 간편해 진다.

$$
\begin{aligned}
P(\mu|D)
&\propto
P(D|\mu)P(\mu)
\\ &\propto
\displaystyle\prod_{n=1}^{N} \mu^{x_n}(1-\mu)^{1-x_n} \cdot \mu^{\alpha-1}(1-\mu)^{\beta-1}
\\ &\propto
\mu^h(1-\mu)^{t} \cdot \mu^{\alpha-1}(1-\mu)^{\beta-1}
\\ &\propto
\mu^{h+\alpha-1}(1-\mu)^{t+\beta-1}
\end{aligned}
$$

<figcaption align="center">
  <b>식 3: 동전 앞면이 나올 확률에 대한 사후 확률 분포</b>
</figcaption>

마찬가지로, \mu의 극대값을 구하기위해 $$P(\mu|D)$$ 식의 $$\mu$$에 대한 미분값을 0으로 하여 계산하게 되면, 아래와 같은 결과를 얻을 수 있다.

$$
\begin{aligned}
\mu_{MAP} = \cfrac {h+\alpha-1} {h+t+\alpha+\beta-2}
\end{aligned}
$$

이때, 동전 시행 횟수가 무한히 많아진다면, 위 식에서 상대적으로 작은 값인 $$\alpha$$와 $$\beta$$의 영향이 거의 없어지기 때문에, 위 값은 위 MLE 방식의 파라미터 추정값과 동일하게 된다고 볼 수 있다. MAP에서 사전 확률 분포를 Uniform Distribution으로 설정하면 이것은 MLE와 같은 결과를 얻을 수 있다.

## Bayesian Inference

위 MAP 방식은 어느정도 Bayesian 방식의 철학을 담고 있다고 하였다. 하지만 MAP로 추정한 파라미터 값 역시 point estimates이기 때문에 한계를 가진다.

진정한 Bayesian 관점으로 파라미터를 추정하기 위해서는 더 많은 정보를 담고 있는 $$P(\mu|D)$$ 분포를 이용하여 사후 확률 분포의 평균(Posterior mean)을 구하는 것이 필요하다. 즉, 모든 가능한 파라미터 셋팅에 대해 평균을 취하는 것이 가장 이상적인 선택이라는 뜻이다.

$$
\begin{aligned}
\mathbb{E}(\mu|D) = \displaystyle\int \mu P(\mu|D) d\mu
\end{aligned}
$$

일반적으로 위 적분은 계산하기가 어려운 경우가 많아 특별한 inference 방식을 사용해야한다.

> Gibbs Sampling 혹은 Variational Inference가 대표적이다.

하지만, 위 식의 경우에는 굉장히 간단한 방법으로 계산을 할 수가 있는데, 앞서 설명 했듯이 $$P(\mu|D)$$는 Likelihood가 베르누이 분포, Prior가 베타 분포로 형성된 Posterior 이다.

베르누이 분포의 conjugate prior인 베타분포를 Prior로 둔 이유가 여기에 있는데, Likelihood와 Prior의 곱으로 표현되는 Posterior 역시 베타 분포로 그 형태가 동일하게 되기 때문에, $$P(\mu|D)$$는 파라미터를 $$\alpha+h$$, $$\beta+t$$로 가지는 베타 분포이고, 이 베타분포의 기댓값이 바로 앞서 구하려고 했던 Posterior mean이라고 볼 수 있다.

$$
\begin{aligned}
\mathbb{E}(\mu|D)
&= \cfrac {\alpha+h} {\alpha+\beta+h+t}
\\ &= \cfrac {\alpha+h} {\alpha+\beta+N}
\end{aligned}
$$
