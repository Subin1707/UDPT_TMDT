import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  Camera,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Globe2,
  Heart,
  Home,
  Languages,
  LayoutDashboard,
  ListFilter,
  LockKeyhole,
  LogIn,
  Map,
  Megaphone,
  MessageCircle,
  MonitorSmartphone,
  Package,
  PackageCheck,
  PackageSearch,
  Radio,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Truck,
  Upload,
  User,
  UserCog,
  Users,
  Video,
  WalletCards,
} from 'lucide-react';
import './styles/app.css';

const navGroups = [
  {
    title: 'Pre-login',
    items: [
      { id: 'splash', label: 'Khoi dong', icon: MonitorSmartphone },
      { id: 'welcome', label: 'Chao mung', icon: Sparkles },
      { id: 'language', label: 'Ngon ngu', icon: Languages },
      { id: 'login', label: 'Dang nhap', icon: LogIn },
      { id: 'register', label: 'Dang ky', icon: User },
      { id: 'otp', label: 'OTP', icon: ShieldCheck },
      { id: 'forgot', label: 'Quen mat khau', icon: LockKeyhole },
    ],
  },
  {
    title: 'Khach hang',
    items: [
      { id: 'home', label: 'Trang chu', icon: Home },
      { id: 'category', label: 'Danh muc', icon: ListFilter },
      { id: 'search', label: 'Tim kiem', icon: Search },
      { id: 'product', label: 'Chi tiet SP', icon: PackageSearch },
      { id: 'review', label: 'Danh gia', icon: Star },
      { id: 'cart', label: 'Gio hang', icon: ShoppingCart },
      { id: 'checkout', label: 'Thanh toan', icon: CreditCard },
      { id: 'success', label: 'Dat hang OK', icon: CheckCircle2 },
      { id: 'tracking', label: 'Theo doi don', icon: Map },
      { id: 'history', label: 'Lich su don', icon: ReceiptText },
      { id: 'wishlist', label: 'Yeu thich', icon: Heart },
      { id: 'notifications', label: 'Thong bao', icon: Bell },
      { id: 'profile', label: 'Ca nhan', icon: UserCog },
    ],
  },
  {
    title: 'Admin',
    items: [
      { id: 'admin-login', label: 'Login admin', icon: ShieldCheck },
      { id: 'admin-dashboard', label: 'Tong quan', icon: LayoutDashboard },
      { id: 'admin-products', label: 'QL san pham', icon: Package },
      { id: 'admin-orders', label: 'QL don hang', icon: PackageCheck },
      { id: 'admin-users', label: 'QL nguoi dung', icon: Users },
      { id: 'admin-vouchers', label: 'QL voucher', icon: WalletCards },
      { id: 'admin-ai', label: 'Thong ke AI', icon: BarChart3 },
    ],
  },
  {
    title: 'Shipper & nang cao',
    items: [
      { id: 'shipper-dashboard', label: 'Shipper', icon: Truck },
      { id: 'shipper-live', label: 'Giao realtime', icon: Activity },
      { id: 'chatbot', label: 'Chatbot AI', icon: Bot },
      { id: 'livestream', label: 'Livestream', icon: Video },
      { id: 'ar', label: 'AR thu san pham', icon: Camera },
    ],
  },
];

const demoProducts = [
  { name: 'Laptop ZenBook 14', price: '18.990.000d', tag: '-18%', rating: 4.9 },
  { name: 'Dien thoai Nova X', price: '9.490.000d', tag: 'Flash', rating: 4.8 },
  { name: 'Tai nghe Sonic Pro', price: '1.290.000d', tag: 'Hot', rating: 4.7 },
  { name: 'May loc khong khi', price: '3.790.000d', tag: 'New', rating: 4.6 },
  { name: 'Ao khoac Premium', price: '590.000d', tag: '-25%', rating: 4.8 },
  { name: 'Ban phim co RGB', price: '890.000d', tag: 'Best', rating: 4.9 },
];

const orders = [
  { id: '#EC2401', customer: 'Nguyen An', status: 'PAID', total: '2.450.000d' },
  { id: '#EC2402', customer: 'Tran Binh', status: 'SHIPPING', total: '890.000d' },
  { id: '#EC2403', customer: 'Le Chi', status: 'PACKING', total: '18.990.000d' },
];

function App() {
  const [active, setActive] = useState('home');
  const [message, setMessage] = useState('Realtime channel ready');
  const [apiStatus, setApiStatus] = useState('Checking API');
  const [apiProducts, setApiProducts] = useState([]);
  const flatItems = useMemo(() => navGroups.flatMap((group) => group.items), []);
  const activeItem = flatItems.find((item) => item.id === active) ?? flatItems[0];
  const catalog = apiProducts.length > 0 ? apiProducts : demoProducts;

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8087/ws/notifications');
    socket.onmessage = (event) => setMessage(event.data);
    socket.onerror = () => setMessage('Notification service offline');
    return () => socket.close();
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        const mapped = (payload.data ?? []).map((item) => ({
          name: item.name,
          price: `${Number(item.price).toLocaleString('vi-VN')}d`,
          tag: `Stock ${item.stock}`,
          rating: 4.8,
        }));
        setApiProducts(mapped);
        setApiStatus(`Backend connected: ${mapped.length} products`);
      })
      .catch(() => setApiStatus('Backend offline: using demo data'));
  }, []);

  return (
    <main className="app-shell">
      <aside className="side-panel">
        <div className="brand">
          <Store size={26} />
          <div>
            <strong>UDPT Shop</strong>
            <span>Microservices</span>
          </div>
        </div>
        <nav className="nav-groups">
          {navGroups.map((group) => (
            <section key={group.title}>
              <p>{group.title}</p>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button className={active === id ? 'active' : ''} key={id} onClick={() => setActive(id)}>
                  <Icon size={17} />
                  <span>{label}</span>
                </button>
              ))}
            </section>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Screen prototype</p>
            <h1>{activeItem.label}</h1>
          </div>
          <div className="top-actions">
            <label className="search-box">
              <Search size={18} />
              <input placeholder="Search products, orders, users" />
            </label>
            <span className="live-pill">
              <Radio size={16} />
              {message}
            </span>
            <span className="live-pill api-pill">
              <Activity size={16} />
              {apiStatus}
            </span>
          </div>
        </header>

        <Screen id={active} products={catalog} />
      </section>
    </main>
  );
}

function Screen({ id, products }) {
  const screens = {
    splash: <SplashScreen />,
    welcome: <WelcomeScreen />,
    language: <LanguageScreen />,
    login: <LoginScreen title="Dang nhap" admin={false} />,
    register: <RegisterScreen />,
    otp: <OtpScreen />,
    forgot: <ForgotPasswordScreen />,
    home: <CustomerHome products={products} />,
    category: <CategoryScreen products={products} />,
    search: <SearchScreen products={products} />,
    product: <ProductDetailScreen product={products[0]} />,
    review: <ReviewScreen />,
    cart: <CartScreen products={products} />,
    checkout: <CheckoutScreen />,
    success: <SuccessScreen />,
    tracking: <TrackingScreen />,
    history: <OrderHistoryScreen />,
    wishlist: <WishlistScreen products={products} />,
    notifications: <NotificationsScreen />,
    profile: <ProfileScreen />,
    'admin-login': <LoginScreen title="Dang nhap quan tri" admin />,
    'admin-dashboard': <AdminDashboard />,
    'admin-products': <AdminProducts />,
    'admin-orders': <AdminOrders />,
    'admin-users': <AdminUsers />,
    'admin-vouchers': <AdminVouchers />,
    'admin-ai': <AdminAi />,
    'shipper-dashboard': <ShipperDashboard />,
    'shipper-live': <ShipperLive />,
    chatbot: <ChatbotScreen />,
    livestream: <LivestreamScreen />,
    ar: <ArScreen />,
  };

  return screens[id] ?? <CustomerHome products={products} />;
}

function SplashScreen() {
  return (
    <section className="phone-stage splash-stage">
      <div className="particle-field" />
      <div className="logo-orbit">
        <ShoppingBag size={54} />
      </div>
      <h2>UDPT Shop</h2>
      <p>Checking token, network and realtime channel</p>
      <div className="loading-bar"><span /></div>
    </section>
  );
}

function WelcomeScreen() {
  return (
    <section className="hero-grid">
      {[
        ['Mua sam nhanh chong', 'Flash sale, voucher va goi y san pham ca nhan hoa'],
        ['Theo doi don realtime', 'Trang thai don hang cap nhat qua WebSocket'],
        ['Thanh toan an toan', 'Ho tro COD, Momo, VNPay va Paypal'],
      ].map(([title, text], index) => (
        <article className="welcome-slide" key={title}>
          <span>0{index + 1}</span>
          <h2>{title}</h2>
          <p>{text}</p>
          <button className="primary-btn">Bat dau ngay <ChevronRight size={16} /></button>
        </article>
      ))}
    </section>
  );
}

function LanguageScreen() {
  return (
    <section className="center-card compact">
      <Globe2 size={42} />
      <h2>Language</h2>
      <div className="choice-list">
        <button className="choice active"><span>VN</span> Tieng Viet</button>
        <button className="choice"><span>EN</span> English</button>
      </div>
    </section>
  );
}

function LoginScreen({ title, admin }) {
  return (
    <section className={admin ? 'auth-layout admin-auth' : 'auth-layout'}>
      <div className="auth-art">
        {admin ? <ShieldCheck size={58} /> : <ShoppingBag size={58} />}
        <h2>{admin ? 'Admin Console' : 'UDPT Shop'}</h2>
        <p>{admin ? 'Dark dashboard access with role guard' : 'Fast checkout, realtime orders and secure account'}</p>
      </div>
      <form className="form-card">
        <h2>{title}</h2>
        <FloatingInput label="Email hoac so dien thoai" />
        <FloatingInput label="Mat khau" type="password" />
        <div className="form-row">
          <label><input type="checkbox" /> Remember me</label>
          <button type="button">Quen mat khau</button>
        </div>
        <button className="primary-btn" type="button">Dang nhap</button>
        {!admin && <div className="oauth-row"><button type="button">Google</button><button type="button">Facebook</button></div>}
      </form>
    </section>
  );
}

function RegisterScreen() {
  return (
    <section className="form-card wide">
      <h2>Tao tai khoan</h2>
      <div className="two-col">
        <FloatingInput label="Ho ten" />
        <FloatingInput label="So dien thoai" />
        <FloatingInput label="Email" />
        <FloatingInput label="Vai tro mac dinh: USER" />
        <FloatingInput label="Mat khau" type="password" />
        <FloatingInput label="Xac nhan mat khau" type="password" />
      </div>
      <div className="strength"><span style={{ width: '72%' }} /></div>
      <label><input type="checkbox" /> Dong y dieu khoan</label>
      <button className="primary-btn" type="button">Dang ky</button>
    </section>
  );
}

function OtpScreen() {
  return (
    <section className="center-card compact">
      <ShieldCheck size={44} />
      <h2>Xac thuc OTP</h2>
      <div className="otp-row">{['', '', '', '', '', ''].map((_, i) => <input key={i} maxLength="1" />)}</div>
      <p>Gui lai sau 00:48</p>
      <button className="primary-btn">Verify</button>
    </section>
  );
}

function ForgotPasswordScreen() {
  return (
    <section className="step-grid">
      {['Email', 'OTP', 'Mat khau moi'].map((step, index) => (
        <article className="step-card" key={step}>
          <span>{index + 1}</span>
          <h3>{step}</h3>
          <FloatingInput label={step} />
        </article>
      ))}
    </section>
  );
}

function CustomerHome({ products }) {
  return (
    <section className="screen-stack">
      <div className="shop-header">
        <div className="logo-chip"><ShoppingBag size={20} /> UDPT Mall</div>
        <label><Search size={18} /><input placeholder="Tim san pham" /></label>
        <button><Bell size={20} /></button>
        <button><ShoppingCart size={20} /></button>
      </div>
      <div className="promo-band">
        <div><p>Flash sale hom nay</p><h2>Giam den 50% cho thiet bi cong nghe</h2></div>
        <button className="primary-btn">Mua ngay</button>
      </div>
      <CategoryChips />
      <ProductGrid items={products} />
    </section>
  );
}

function CategoryScreen({ products }) {
  return (
    <section className="catalog-layout">
      <aside className="filter-panel">
        <h3>Bo loc</h3>
        {['Gia', 'Thuong hieu', 'Rating', 'Mau sac'].map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}
      </aside>
      <div>
        <div className="section-head"><h2>Danh muc san pham</h2><button>Sort: Best seller</button></div>
        <ProductGrid items={products} />
      </div>
    </section>
  );
}

function SearchScreen({ products }) {
  return (
    <section className="screen-stack">
      <label className="big-search"><Search size={22} /><input value="laptop" readOnly /></label>
      <div className="tag-row">{['laptop gaming', 'iphone', 'ao khoac', 'ban phim co'].map((tag) => <button key={tag}>{tag}</button>)}</div>
      <ProductGrid items={products} />
    </section>
  );
}

function ProductDetailScreen({ product = demoProducts[0] }) {
  return (
    <section className="product-detail">
      <div className="gallery">
        <div className="product-visual"><Package size={80} /></div>
        <div className="thumb-row"><span /><span /><span /><span /></div>
      </div>
      <div className="detail-panel">
        <span className="badge">Best seller</span>
        <h2>{product.name}</h2>
        <div className="rating"><Star size={18} fill="currentColor" /> 4.9 | 2.1k danh gia</div>
        <strong className="price">{product.price}</strong>
        <div className="variant-row"><button>Silver</button><button>Black</button><button>16GB RAM</button></div>
        <div className="tabs"><button className="active">Mo ta</button><button>Danh gia</button><button>Thong so</button></div>
        <p>Man hinh OLED, CPU tiet kiem dien, phu hop hoc tap va cong viec.</p>
        <div className="action-row"><button className="secondary-btn">Them gio</button><button className="primary-btn">Mua ngay</button></div>
      </div>
    </section>
  );
}

function ReviewScreen() {
  return (
    <section className="form-card wide">
      <h2>Danh gia san pham</h2>
      <div className="star-row">{[1, 2, 3, 4, 5].map((item) => <Star key={item} fill="currentColor" />)}</div>
      <textarea placeholder="Binh luan cua ban" />
      <button className="upload-btn"><Upload size={18} /> Upload anh/video</button>
      <button className="primary-btn">Gui danh gia</button>
    </section>
  );
}

function CartScreen({ products }) {
  return (
    <section className="checkout-layout">
      <div className="card-list">{products.slice(0, 3).map((product) => <CartItem key={product.name} product={product} />)}</div>
      <OrderSummary button="Thanh toan" />
    </section>
  );
}

function CheckoutScreen() {
  return (
    <section className="checkout-layout">
      <div className="screen-stack">
        <StepIndicator steps={['Dia chi', 'Van chuyen', 'Thanh toan']} />
        <Panel title="Dia chi giao hang"><p>12 Nguyen Hue, Quan 1, TP.HCM</p></Panel>
        <Panel title="Phuong thuc thanh toan">
          <div className="payment-grid">{['VNPay', 'Momo', 'Paypal', 'COD'].map((item) => <button key={item}>{item}</button>)}</div>
        </Panel>
      </div>
      <OrderSummary button="Dat hang" />
    </section>
  );
}

function SuccessScreen() {
  return (
    <section className="center-card compact success">
      <CheckCircle2 size={64} />
      <h2>Dat hang thanh cong</h2>
      <p>Ma don hang #EC2409</p>
      <button className="primary-btn">Theo doi don</button>
    </section>
  );
}

function TrackingScreen() {
  return (
    <section className="tracking-layout">
      <div className="map-panel"><Map size={76} /><span>Live shipper map</span></div>
      <Timeline items={['Dat hang', 'Da thanh toan', 'Dang dong goi', 'Dang giao', 'Hoan thanh']} active={3} />
    </section>
  );
}

function OrderHistoryScreen() {
  return <OrderCards title="Lich su don hang" />;
}

function WishlistScreen({ products }) {
  return (
    <section className="screen-stack">
      <div className="section-head"><h2>Yeu thich</h2><span>{products.length} san pham</span></div>
      <ProductGrid items={products} />
    </section>
  );
}

function NotificationsScreen() {
  return (
    <section className="card-list">
      {['Don #EC2402 dang giao', 'Voucher cong nghe giam 50k', 'Flash sale 20:00', 'San pham yeu thich da giam gia'].map((text) => (
        <article className="notification-card" key={text}><Bell size={20} /><span>{text}</span><b>New</b></article>
      ))}
    </section>
  );
}

function ProfileScreen() {
  return (
    <section className="profile-layout">
      <div className="profile-card"><div className="avatar">A</div><h2>Nguyen Van A</h2><p>USER</p></div>
      <div className="stats-grid">
        {['Dia chi', 'Voucher', 'Don hang', 'Diem tich luy'].map((item, index) => <StatCard key={item} label={item} value={String((index + 1) * 4)} />)}
      </div>
    </section>
  );
}

function AdminDashboard() {
  return (
    <section className="screen-stack">
      <div className="stats-grid">
        <StatCard label="Doanh thu" value="125M" />
        <StatCard label="Tong don" value="1.284" />
        <StatCard label="Nguoi dung" value="8.402" />
        <StatCard label="San pham" value="642" />
      </div>
      <div className="dashboard-grid">
        <ChartCard title="Revenue chart" />
        <ChartCard title="Traffic chart" />
      </div>
    </section>
  );
}

function AdminProducts() {
  return (
    <section className="screen-stack">
      <div className="section-head"><h2>Quan ly san pham</h2><button className="primary-btn">Them san pham</button></div>
      <DataTable columns={['Ten', 'Gia', 'Ton kho', 'Trang thai']} rows={demoProducts.map((p) => [p.name, p.price, '24', 'Active'])} />
      <button className="upload-btn"><Upload size={18} /> Import Excel / Upload anh</button>
    </section>
  );
}

function AdminOrders() {
  return (
    <section className="screen-stack">
      <OrderCards title="Quan ly don hang" />
      <Panel title="Cap nhat trang thai"><Timeline items={['CREATED', 'PAID', 'PACKING', 'SHIPPING', 'COMPLETED']} active={2} /></Panel>
    </section>
  );
}

function AdminUsers() {
  return <DataTable columns={['Nguoi dung', 'Email', 'Role', 'Trang thai']} rows={[
    ['Admin', 'admin@shop.vn', 'ADMIN', 'Active'],
    ['Nhan vien', 'staff@shop.vn', 'STAFF', 'Active'],
    ['Khach hang', 'user@shop.vn', 'USER', 'Active'],
  ]} />;
}

function AdminVouchers() {
  return (
    <section className="voucher-grid">
      {['FREESHIP', 'SALE50', 'TECH100K'].map((code) => (
        <article className="voucher-card" key={code}><Megaphone size={24} /><h3>{code}</h3><p>Het han 30/06/2026</p><button>Chinh sua</button></article>
      ))}
    </section>
  );
}

function AdminAi() {
  return (
    <section className="dashboard-grid">
      <ChartCard title="AI recommendation heatmap" />
      <ChartCard title="Sales forecast" />
      <ChartCard title="Category pie chart" />
    </section>
  );
}

function ShipperDashboard() {
  return (
    <section className="checkout-layout">
      <OrderCards title="Don can giao" />
      <Panel title="Thu nhap hom nay"><strong className="price">420.000d</strong><p>8 don da hoan thanh</p></Panel>
    </section>
  );
}

function ShipperLive() {
  return (
    <section className="map-full">
      <Map size={88} />
      <h2>Realtime GPS Delivery</h2>
      <div className="route-line"><span /></div>
      <p>ETA 18 phut | 3.2 km</p>
    </section>
  );
}

function ChatbotScreen() {
  return (
    <section className="chat-layout">
      <div className="chat-window">
        <ChatBubble bot text="Xin chao, toi co the ho tro don hang nao?" />
        <ChatBubble text="Don #EC2402 dang o dau?" />
        <ChatBubble bot text="Don hang dang giao va du kien den trong 18 phut." />
      </div>
      <div className="suggestions"><button>Tra cuu don hang</button><button>Chinh sach doi tra</button><button>Voucher moi</button></div>
    </section>
  );
}

function LivestreamScreen() {
  return (
    <section className="live-commerce">
      <div className="video-pane"><Video size={70} /><span>LIVE 12.4K</span></div>
      <div className="live-side">
        <h2>Livestream Shopping</h2>
        <ProductCard product={demoProducts[2]} />
        <ChatBubble bot text="Deal tai nghe chi con 10 phut" />
        <button className="primary-btn">Them vao gio realtime</button>
      </div>
    </section>
  );
}

function ArScreen() {
  return (
    <section className="ar-stage">
      <Camera size={82} />
      <h2>AR Product Preview</h2>
      <div className="ar-object"><Package size={52} /></div>
      <p>Camera preview + 3D overlay</p>
    </section>
  );
}

function FloatingInput({ label, type = 'text' }) {
  return <label className="floating-input"><span>{label}</span><input type={type} /></label>;
}

function CategoryChips() {
  return <div className="category-chips">{['Dien thoai', 'Laptop', 'Thoi trang', 'Gia dung', 'Voucher', 'Best seller'].map((item) => <button key={item}>{item}</button>)}</div>;
}

function ProductGrid({ items = demoProducts }) {
  return <div className="product-grid">{items.map((product) => <ProductCard product={product} key={product.name} />)}</div>;
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image"><Package size={38} /><span>{product.tag}</span></div>
      <h3>{product.name}</h3>
      <div className="rating"><Star size={15} fill="currentColor" /> {product.rating}</div>
      <strong>{product.price}</strong>
      <button className="secondary-btn">Them gio</button>
    </article>
  );
}

function CartItem({ product }) {
  return (
    <article className="cart-item">
      <div className="mini-image"><Package size={24} /></div>
      <div><h3>{product.name}</h3><span>{product.price}</span></div>
      <div className="qty"><button>-</button><b>1</b><button>+</button></div>
    </article>
  );
}

function OrderSummary({ button }) {
  return (
    <aside className="summary-card">
      <h3>Tong don</h3>
      <p>Tam tinh <b>21.170.000d</b></p>
      <p>Voucher <b>-120.000d</b></p>
      <strong>21.050.000d</strong>
      <button className="primary-btn">{button}</button>
    </aside>
  );
}

function StepIndicator({ steps }) {
  return <div className="step-indicator">{steps.map((step, i) => <span className={i === 1 ? 'active' : ''} key={step}>{step}</span>)}</div>;
}

function Panel({ title, children }) {
  return <article className="panel"><h3>{title}</h3>{children}</article>;
}

function Timeline({ items, active }) {
  return <div className="timeline">{items.map((item, index) => <div className={index <= active ? 'done' : ''} key={item}><span />{item}</div>)}</div>;
}

function OrderCards({ title }) {
  return (
    <section className="card-list">
      <div className="section-head"><h2>{title}</h2><button>Filter</button></div>
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <ReceiptText size={24} />
          <div><h3>{order.id}</h3><p>{order.customer}</p></div>
          <span className="badge">{order.status}</span>
          <strong>{order.total}</strong>
        </article>
      ))}
    </section>
  );
}

function StatCard({ label, value }) {
  return <article className="stat-card"><span>{label}</span><strong>{value}</strong><Activity size={20} /></article>;
}

function ChartCard({ title }) {
  return (
    <article className="chart-card">
      <h3>{title}</h3>
      <div className="bars">{[42, 76, 58, 88, 64, 95, 72].map((height, index) => <span style={{ height: `${height}%` }} key={index} />)}</div>
    </article>
  );
}

function DataTable({ columns, rows }) {
  return (
    <section className="data-table">
      <div className="table-row head">{columns.map((col) => <b key={col}>{col}</b>)}</div>
      {rows.map((row, index) => <div className="table-row" key={index}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}
    </section>
  );
}

function ChatBubble({ text, bot }) {
  return <div className={bot ? 'chat-bubble bot' : 'chat-bubble'}>{bot && <Bot size={16} />}<span>{text}</span></div>;
}

createRoot(document.getElementById('root')).render(<App />);
