# Gibbs Sampling
> Gibbs Sampling을 구현하기위해 사용한 Inverse Transform Sampling 기법을 소개하면서 실질적인 구현 방법을 먼저 소개하고, 이론적인 배경은 나중에 업데이트 할 예정이다.

## Inverse Transform Sampling

[LDA](/docs/research/topic-modeling/lda)에서 다음과 같은 Sampling Equation을 유도 했는데, 이걸 어떻게 샘플링을 해야하는지 알아내는 데 굉장히 오랜 시간이 걸렸다.

$$
\begin{aligned}
P(Z_{(m,n)} = v|Z_{-(m,n)}, W;\alpha,\beta)
&\propto
\bigg( n_{m,(\cdot)}^{k,-(m,n)} + \alpha_{k} \bigg) \cfrac { \Gamma \bigg( n_{(\cdot),v}^{k,-(m,n)} + \beta_{v} \bigg) } {\sum_{r=1}^{V}  n_{(\cdot),r}^{k,-(m,n)} + \beta_{r}}

\end{aligned}
$$

<figcaption align="center">
  <b>식 1: LDA sampling equation</b>
</figcaption>

공부를 하다가 어느날 우연히 찾아낸 방법이 바로 inverse transform sampling이라는 것이 었는데, [위키피디아](https://en.wikipedia.org/wiki/Inverse_transform_sampling)에 자세한 설명이 나와 있지만, 간단하게 핵심 아이디어만 소개해 보겠다.

Inverse transform sampling은 다음의 절차를 따른다.

1. 샘플을 얻고 싶은 확률 분포(예: LDA의 sampling equation)로부터 누적 확률 분포(CDF: Cumulative Distribution Fuction), $$Y = F_X(x) = Pr(X \leqq x)$$를구한다. (우리가 얻고 싶은 샘플이 바로 이 $$x$$이다,
2. CDF의 역함수, $$ X=F_X^{-1}(y)$$ 를 구한다. 이때 $$Y$$는 누적확률분포이므로 $$0 \leqq y \leqq 1$$ 이다)
3. 균등 분포 $$U ~ Unif[0, 1]$$로 부터 샘플 $$u$$를 생성한다. (난수 생성)
4. 2에서 구한 역함수에 u를 대입한 $$ F_X^{-1}(u)$$가 바로 우리가 구하고자하는 샘플 $$x$$가 된다.

위 방식에 대한 간단한 증명법이 있지만, 그것 보다는 아래 그림을 통해 이 방법이 타당하다는 것을 직관적으로 알 수 있다.

<img width="400" src="/assets/study/inverse-transform-sampling/Inverse_Transform_Sampling_Example.gif" />
<figcaption align="center">
  <b>그림1: Inverse transform sampling으로 정규 분포 만들기 (출처: 위키피디아)</b>
</figcaption>

위 그림에서 y축 위에 쌓이는 데이터들은 난수 생성으로 얻을 수 있는 균등 분포의 샘플이고, 이 샘플 각각에 대응하는 x축 위의 값이 우리가 얻고자 하는 목표 분포의 샘플이라고 할 수 있다. 실제 위 그림은 정규 분포의 누적확률분포를 이용한 샘플링을 시뮬레이션 한 것이다.

물론 누적 분포 구하는 것 자체에 적분이 수반되기 때문에 computation 관점에서 어려울 수 있고, 역함수를 구하는 과정이 해석적이지 않을 수 있지만, 적어도 LDA경우는 discrete한 값인 $$z$$(topic indicator)를 샘플링하는 것은 가능하다. (실제로 나중에 설명할 Correlated Topic Model을 Gibbs Sampling으로 구현하기 위해서는 다른 샘플링 전략이 필요하다.)

```java
int newTopic = -1;
double[] probs = new double[K];
for (int k = 0; k < K; k++) {
    double prob = calc.calculateProb(document, word, k); // prob. by sampling equation
    probs[k] = prob;
}
for(int k=1; k<K ;k++) {
    probs[k] += probs[k-1]; // cdf.
}
double u = Math.random() * probs[K-1];
for(newTopic = 0; newTopic<K; newTopic++) {
    if(probs[newTopic] > u)
        break;
}
```

<figcaption align="center">
  <b>Inverse transform sampling 구현</b>
</figcaption>

위 코드는 내가 LDA를 구현하면서 Invere transform sampling의 방법을 적용한 것인데, 앞서 설명한 아이디어를 이용해 코드가 구현되어 있는 것을 알 수 있다.

이 방법을 알게된 이후 부터, Gibbs Sampling 방식으로 베이지안 모델을 구현하는데 속도가 붙었었고, 개인적으로 아래와 같은 모델을 이 방식을 이용하여 직접 구현해 보면서 많은 공부가 되었다.

1. [Latent Dirichlet Allocatio (LDA)](/docs/research/topic-modeling/lda)
2. [Hierarchical Dirichlet Process (HDP)](/docs/research/topic-modeling/hdp)
3. [Gaussain LDA (GLDA)](/docs/research/topic-modeling/glda)
4. [Correlated Topic Model (CTM)](/docs/research/topic-modeling/ctm)

한 가지 주의해야 할 것은, Gibbs Samping 방식으로 추론을 하기 위해서는 위와 같은 Sampling Equation을 유도해야하는데, LDA에서 소개했듯이 만만치 않다. (LDA가 그중 가장 쉬운거라고 생각하면됨)

> 일반적으로는 Prior를 선택할 때, Conjugate Prior를 선택해야 유도가 가능하다

특히 위 4번 CTM은 LDA 논문을 쓴 저자가 후속 연구로 냈던 방법인데, 저자는 Gibbs Sampling이 아닌 Variational Inference 계열의 방식을 택했다. 왜냐하면 해당 모델에서 사용하는 확률 분포가 conjugate한 관계가 아니었기 때문인데, 이걸 또 Gibbs Sampling으로 구현하기 위한 연구자가 있었고, 나는 이 방식을 이용하여 CTM을 구현했다. 굉장히 수학적인 내용이 많아서 고생을 많이 했지만, 시간을 내서 정리할 계획이다. (4번 구현이 가장 어려웠고 3번은 개념 자체가 어려웠음)

또한 [Variational Inference](/docs/research/bayesian-inference/variational-inference)에 대해서도 소개를 하려고 한다. (이것도 어려움)
