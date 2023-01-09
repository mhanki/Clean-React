export default {
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn()
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('y'), 100))
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('n'), 100))
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('gibberish'), 100)),
    close: jest.fn()
  })
}