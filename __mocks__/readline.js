export default {
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn()
      .mockImplementationOnce((questionText, cb) => setTimeout(() => cb('y'), 100))
      .mockImplementationOnce((questionText, cb) => setTimeout(() => cb('n'), 100))
      .mockImplementationOnce((questionText, cb) => setTimeout(() => cb('gibberish'), 100)),
    close: jest.fn()
  })
}