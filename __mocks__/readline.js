export default {
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn()
      .mockImplementationOnce((questionText, cb) => setTimeout(() => cb('y'), 500))
      .mockImplementationOnce((questionText, cb) => setTimeout(() => cb('n'), 500))
      .mockImplementationOnce((questionText, cb) => setTimeout(() => cb('gibberish'), 500)),
    close: jest.fn()
  })
}