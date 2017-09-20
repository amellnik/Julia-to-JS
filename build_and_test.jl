if !isdir("/out")
    mkdir("/out")
end
run(`docker build -t jfs .`)
pd = pwd()
run(`docker run --rm --mount type=bind,source="$pd"/out,target=/out jfs`)
run(`node test_output.js`)
