import { useState } from 'react'
import './App.css'

const getIMCClassification = (imc) => {
  if (imc < 18.5) return 'Abaixo do peso'
  if (imc < 25) return 'Peso normal'
  if (imc < 30) return 'Sobrepeso'
  if (imc < 35) return 'Obesidade I'
  if (imc < 40) return 'Obesidade II'
  return 'Obesidade III'
}

const calculateIMCValue = (weight, height, unit) => {
  const weightInKg = unit === 'metric' ? weight : weight * 0.45359237
  const heightInMeters = unit === 'metric' ? height / 100 : height * 0.0254

  if (weightInKg <= 0 || heightInMeters <= 0) {
    return null
  }

  return weightInKg / heightInMeters ** 2
}

function App() {
  const [unit, setUnit] = useState('metric')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmi, setBmi] = useState(null)
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const handleUnitChange = (event) => {
    setUnit(event.target.value)
    setError('')
  }

  const clearFields = () => {
    setWeight('')
    setHeight('')
    setBmi(null)
    setCategory('')
    setError('')
  }

  const calculateIMC = (event) => {
    event.preventDefault()

    const weightValue = Number(weight)
    const heightValue = Number(height)

    if (!weightValue || !heightValue || weightValue <= 0 || heightValue <= 0) {
      setError('Informe peso e altura válidos.')
      setBmi(null)
      setCategory('')
      return
    }

    const imc = calculateIMCValue(weightValue, heightValue, unit)

    if (imc === null) {
      setError('Informe peso e altura válidos.')
      setBmi(null)
      setCategory('')
      return
    }

    const imcFormatted = imc.toFixed(1)
    const classification = getIMCClassification(imc)

    setBmi(imcFormatted)
    setCategory(classification)
    setError('')
    setHistory((previousHistory) => [
      {
        id: Date.now(),
        value: imcFormatted,
        category: classification,
        unitLabel: unit === 'metric' ? 'kg / m' : 'lb / in',
      },
      ...previousHistory,
    ].slice(0, 5))
  }

  return (
    <div className="app-shell">
      <div className="calculator-card">
        <div className="header">
          <span className="badge">Saúde</span>
          <h1>Calculadora de IMC</h1>
        </div>

        <form className="calculator-form" onSubmit={calculateIMC}>
          <label className="field">
            <span>Unidade</span>
            <select value={unit} onChange={handleUnitChange} className="unit-select">
              <option value="metric">kg / cm</option>
              <option value="imperial">lb / in</option>
            </select>
          </label>

          <label className="field">
            <span>{unit === 'metric' ? 'Peso (kg)' : 'Peso (lb)'}</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder={unit === 'metric' ? 'Ex: 68.5' : 'Ex: 150.5'}
            />
          </label>

          <label className="field">
            <span>{unit === 'metric' ? 'Altura (cm)' : 'Altura (in)'}</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={height}
              onChange={(event) => setHeight(event.target.value)}
              placeholder={unit === 'metric' ? 'Ex: 170' : 'Ex: 67'}
            />
          </label>

          <div className="button-row">
            <button type="submit" className="primary-button">Calcular IMC</button>
            <button type="button" className="secondary-button" onClick={clearFields}>
              Limpar
            </button>
          </div>
        </form>

        {error && <p className="message error">{error}</p>}

        {bmi !== null && !error && (
          <div className="result-box">
            <p className="result-label">Seu IMC</p>
            <div className="result-value">{bmi}</div>
            <p className="result-category">{category}</p>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-box">
            <h3>Histórico</h3>
            <ul>
              {history.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.value}</strong>
                    <span>{item.category}</span>
                  </div>
                  <small>{item.unitLabel}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
