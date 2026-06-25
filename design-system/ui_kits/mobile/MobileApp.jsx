// MobileApp — TARS iOS app: dashboard, journey, contacts with a bottom tab bar.
const { Card, KPICard, ProgressBar, StageStep, ListRow, Avatar, Badge, Pill, Icon, IconChip } = window.TARSDesignSystem_9af650;

function MHeader({ title, subtitle }) {
  return (
    <div style={{ padding: '6px 20px 14px' }}>
      {subtitle && <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{subtitle}</div>}
      <h1 style={{ margin: '3px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.5px' }}>{title}</h1>
    </div>
  );
}

function DashboardTab() {
  const D = window.TARS_DATA;
  return (
    <div style={{ paddingBottom: 12 }}>
      <MHeader subtitle="Good morning" title="Hi, Alex" />
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Property hero */}
        <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <div style={{ height: 96, background: 'linear-gradient(135deg, var(--primary), var(--sell))', display: 'flex', alignItems: 'flex-start', padding: 14 }}>
            <Pill tone="ghost" style={{ background: 'rgba(255,255,255,.92)', color: 'var(--ink)' }} dot>{D.property.status}</Pill>
          </div>
          <div style={{ background: 'var(--surface)', padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>{D.property.address}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>{D.property.city}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>Est. value</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 19, marginTop: 1 }}>$842,000</div>
              </div>
              <Badge tone="success" dot>+4.2%</Badge>
            </div>
          </div>
        </div>

        {/* KPI pair */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {D.kpis.slice(1, 3).map((k, i) => (
            <KPICard key={i} icon={<Icon name={k.icon} />} tone={k.tone} value={k.value} label={k.label} delta={k.delta} deltaDir={k.dir} />
          ))}
        </div>

        {/* Journey snapshot */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Your journey</h2>
            <Badge tone="primary" dot>5 of 6</Badge>
          </div>
          <ProgressBar value={70} tone="blue" style={{ marginBottom: 14 }} />
          {D.journey.slice(3, 6).map((s, i, arr) => (
            <StageStep key={i} index={i + 4} title={s.title} caption={s.caption} state={s.state} last={i === arr.length - 1} />
          ))}
        </Card>
      </div>
    </div>
  );
}

function JourneyTab() {
  const D = window.TARS_DATA;
  return (
    <div style={{ paddingBottom: 12 }}>
      <MHeader subtitle="Home ownership" title="Journey" />
      <div style={{ padding: '0 20px' }}>
        <Card>
          <ProgressBar value={70} tone="blue" label="Overall progress" showPct style={{ marginBottom: 18 }} />
          {D.journey.map((s, i) => (
            <StageStep key={i} index={i + 1} title={s.title} caption={s.caption} state={s.state} last={i === D.journey.length - 1} />
          ))}
        </Card>
      </div>
    </div>
  );
}

function ContactsTab() {
  const D = window.TARS_DATA;
  return (
    <div style={{ paddingBottom: 12 }}>
      <MHeader subtitle="Your team" title="Contacts" />
      <div style={{ padding: '0 20px' }}>
        <Card padding={0} style={{ overflow: 'hidden' }}>
          {D.contacts.map((c, i) => (
            <ListRow key={i}
              leading={<Avatar name={c.name} tone={c.tone} size={40} />}
              title={c.name} subtitle={`${c.role} · ${c.org}`}
              trailing={<Icon name="chevronRight" size={18} color="var(--ink-3)" />}
              divider={i < D.contacts.length - 1}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}

function MobileApp() {
  const [tab, setTab] = React.useState('home');
  const tabs = [
    { id: 'home',     icon: 'home',  label: 'Home' },
    { id: 'journey',  icon: 'layers', label: 'Journey' },
    { id: 'contacts', icon: 'users', label: 'Team' },
  ];
  const body = tab === 'home' ? <DashboardTab /> : tab === 'journey' ? <JourneyTab /> : <ContactsTab />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 52 }}>{body}</div>
      {/* Bottom tab bar */}
      <div style={{
        display: 'flex', borderTop: '1px solid var(--border)', background: 'var(--surface)',
        padding: '8px 24px 4px',
      }}>
        {tabs.map(t => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, border: 'none', background: 'transparent', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, padding: '4px 0', cursor: 'pointer',
              color: on ? 'var(--primary)' : 'var(--ink-3)',
            }}>
              <Icon name={t.icon} size={22} color={on ? 'var(--primary)' : 'var(--ink-3)'} strokeWidth={on ? 2.2 : 1.75} />
              <span style={{ fontSize: 10.5, fontWeight: 600 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

window.MobileApp = MobileApp;
