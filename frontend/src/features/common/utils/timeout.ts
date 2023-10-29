const timeout = async (ms: number) => new Promise((res) => setTimeout(res, ms));

export default timeout;
