# Matrix Factorization

Matrix Factorization은 추천 시스템에서 협업 필터링(Collaborative Filtering) 알고리즘에 속한다. 아이디어는 상당히 간단한데 User와 Item을 행과 열로 가진 Matrix 분해햐여 User와 Item을 low dimensional latent space에 사상 시키는 방법이다. 이를 위해 아랴와 같이 크게 두가지 방식으로 User-Item Matrix를 Decomposition 할 수 있다.

1. Singular Value Decomposition (SVD)
2. Alternating Least Square

먼저 Singular Value Decomposition에 대한 개념은 [별도 페이지](/docs/study/svd)에 정리 했으니 참고하면 좋을 것 같다.

