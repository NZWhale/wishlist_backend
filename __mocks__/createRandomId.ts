const createRandomId = (idLength: number, seed: string) => {
    const fill = idLength - seed.length > 0 ? Array(idLength - seed.length).join("x") : "";
    return "x" + (seed + fill).slice(0, idLength - 1)
}

export default createRandomId;