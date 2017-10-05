using StaticArrays
struct X
    a::Float64
    b::Float64
end

function myspecialfun(a)
    x = SVector(1., 2., a)
    y = SVector(a, a, 3.)
    z = X(a, 2*a)
    return sum(x + 2*y) - z.b + z.a
end
