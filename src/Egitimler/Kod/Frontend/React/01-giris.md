# React Giriş

React, Facebook tarafından geliştirilen açık kaynak kodlu bir JavaScript kütüphanesidir. Kullanıcı arayüzleri oluşturmak için kullanılır ve modern web geliştirme yaklaşımlarını destekler.

## React'in Temel Özellikleri

- **Bileşen Tabanlı**: Kullanıcı arayüzü, yeniden kullanılabilir, bağımsız bileşenlerden oluşur.
- **Sanal DOM**: React, DOM işlemlerini optimize etmek için sanal bir DOM kullanır.
- **JSX**: JavaScript XML olarak bilinen, HTML benzeri bir sözdizimi kullanır.
- **Tek Yönlü Veri Akışı**: Veri, üst bileşenlerden alt bileşenlere tek yönlü akar.

## React Hooks

React Hooks, fonksiyonel bileşenlerde state ve yaşam döngüsü özelliklerinin kullanılmasını sağlar.

### useState Hook'u

useState, bir bileşenin durumunu (state) yönetmek için kullanılır. İki değer döndürür:

1. Mevcut state değeri
2. State'i güncelleyen bir fonksiyon

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Şu anki sayaç: {count}</p>
      <button onClick={() => setCount(count + 1)}>Artır</button>
    </div>
  );
}
```

### useEffect Hook'u

useEffect, yan etkileri (side effects) yönetmek için kullanılır. Bileşenin render edilmesi, güncellenmesi veya kaldırılması durumlarında çalışabilir.

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Geçen süre: {seconds} saniye</div>;
}
```

## React Uygulaması Oluşturma

React uygulaması oluşturmak için genellikle Create React App veya Vite gibi araçlar kullanılır.

```bash
# Create React App ile
npx create-react-app my-app

# Vite ile
npm create vite@latest my-app -- --template react
```

Bu dosya, React'in temel kavramlarını ve özellikle useState hook'unu anlatmak için hazırlanmıştır. 