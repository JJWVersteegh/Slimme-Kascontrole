'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <main style={{minHeight:'100vh',background:'#faf8f3',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',padding:'40px 20px'}}>
      <div style={{textAlign:'center',maxWidth:'600px'}}>
        <div style={{background:'#3a6b1e',width:'56px',height:'56px',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
          <svg width="28" height="28" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 style={{fontSize:'2rem',fontWeight:'700',color:'#0d3d2e',marginBottom:'8px'}}>Slimme Kascontrole</h1>
        <p style={{color:'#6aaa2a',fontWeight:'500',marginBottom:'32px'}}>voor elke vereniging</p>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/tarieven" style={{background:'#0d3d2e',color:'white',padding:'14px 28px',borderRadius:'8px',textDecoration:'none',fontWeight:'600'}}>Bekijk tarieven</Link>
          <Link href="/mijn-omgeving" style={{background:'white',color:'#0d3d2e',padding:'14px 28px',borderRadius:'8px',textDecoration:'none',fontWeight:'600',border:'2px solid #0d3d2e'}}>Mijn omgeving</Link>
        </div>
      </div>
    </main>
  )
}
