# NumPy

# np.array
```python
a = np.array([1, 2, 3])
b = np.array(["a", "b", "c"])
c = np.array([["a"], ["a", "b"], ["a", "c"], ["a", "b", "c"]])

print(a)
print(b)
print(c)
```
```
[1 2 3]

['a' 'b' 'c']

[list(['a']) list(['a', 'b']) list(['a', 'c']) list(['a', 'b', 'c'])]
```

# np.ones

# np.zeros


# np.arrange
- 주어진 범위 안에서 순차적으로 증가하는 리스트 만들기
- np.arange([start,] stop, [step, ] dtype=None)

```python
print(np.arange(10))
print(np.arange(3,7, dtype=np.float))
print(np.arange(3,10,2))
```
```
[0 1 2 3 4 5 6 7 8 9]

[3. 4. 5. 6.]

[3 5 7 9]
```


# .reshpe


# axis
- x는 shape이 (3,3) 매트릭스
- axis=0은 첫번째 축, 즉 (3, 3) 매트릭스의 첫번째 axis인 행(row)만 남도록 나머지 차원의 값들을 합산

```python
x = np.array([[1,3,5],[7,9,11],[13,15,17]])
print(x)
print(x.sum(axis = 0))
print(x.sum(axis = 1))
```
```

[[ 1  3  5]
 [ 7  9 11]
 [13 15 17]]

[21 27 33]

[ 9 27 45]
```