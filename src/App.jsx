import './App.css'
import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Acc } from './components/Acc'
import { Acclist } from './components/Acclist'

function App() {
  const [page, setPage] = useState('add')
  const [editing, setEditing] = useState(null)

  const goTo = (next) => {
    setPage(next)
    if (next === 'add') setEditing(null)
  }

  return (
    <div className="app" id="top">
      <Navbar page={page} onNavigate={goTo} />

      <div className="workspace">
        <main className={`page ${page}`}>
          {page === 'add' ? (
            <Acc
              editing={editing}
              onSaved={() => {
                setEditing(null)
                goTo('manage')
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <Acclist
              onEdit={(product) => {
                setEditing(product)
                setPage('add')
              }}
            />
          )}
        </main>

        <footer className="footer">
          Built with React + Firebase ~ Design by Prawin©• <span className="muted">{new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  )
}

export default App
