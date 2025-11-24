import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  discount?: number;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Беспроводные наушники Premium',
    price: 8990,
    image: 'https://cdn.poehali.dev/projects/cde51d07-308f-4066-95d4-727e9942341a/files/9934e55c-9ac0-4e13-88c5-797e6c7ddc25.jpg',
    category: 'Электроника',
    rating: 4.8,
    reviews: 234,
    discount: 20
  },
  {
    id: 2,
    name: 'Ноутбук Ultrabook',
    price: 89990,
    image: 'https://cdn.poehali.dev/projects/cde51d07-308f-4066-95d4-727e9942341a/files/8ad2b0ad-a5b0-4965-8451-346824259c89.jpg',
    category: 'Компьютеры',
    rating: 4.9,
    reviews: 156
  },
  {
    id: 3,
    name: 'Смарт-часы Elite',
    price: 24990,
    image: 'https://cdn.poehali.dev/projects/cde51d07-308f-4066-95d4-727e9942341a/files/7df57b08-c984-4312-85df-14bdc96da566.jpg',
    category: 'Гаджеты',
    rating: 4.7,
    reviews: 89,
    discount: 15
  },
  {
    id: 4,
    name: 'Беспроводная мышь',
    price: 2990,
    image: 'https://cdn.poehali.dev/projects/cde51d07-308f-4066-95d4-727e9942341a/files/9934e55c-9ac0-4e13-88c5-797e6c7ddc25.jpg',
    category: 'Аксессуары',
    rating: 4.6,
    reviews: 412
  },
  {
    id: 5,
    name: 'Механическая клавиатура',
    price: 7990,
    image: 'https://cdn.poehali.dev/projects/cde51d07-308f-4066-95d4-727e9942341a/files/8ad2b0ad-a5b0-4965-8451-346824259c89.jpg',
    category: 'Аксессуары',
    rating: 4.9,
    reviews: 567,
    discount: 10
  },
  {
    id: 6,
    name: 'Портативная колонка',
    price: 4990,
    image: 'https://cdn.poehali.dev/projects/cde51d07-308f-4066-95d4-727e9942341a/files/7df57b08-c984-4312-85df-14bdc96da566.jpg',
    category: 'Аудио',
    rating: 4.5,
    reviews: 289
  }
];

const promoCodes = [
  { code: 'WELCOME20', discount: 20, minAmount: 5000 },
  { code: 'SALE15', discount: 15, minAmount: 3000 },
  { code: 'MEGA30', discount: 30, minAmount: 10000 }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<typeof promoCodes[0] | null>(null);

  const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success('Товар добавлен в корзину!');
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const applyPromoCode = () => {
    const promo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (!promo) {
      toast.error('Промокод не найден');
      return;
    }
    if (subtotal < promo.minAmount) {
      toast.error(`Минимальная сумма заказа: ${promo.minAmount}₽`);
      return;
    }
    setAppliedPromo(promo);
    toast.success(`Промокод применён! Скидка ${promo.discount}%`);
  };

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const total = subtotal - promoDiscount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Маркетплейс
            </h1>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Icon name="Heart" size={24} />
                    {favorites.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-secondary">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Избранное</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {favorites.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Пока пусто</p>
                    ) : (
                      products
                        .filter(p => favorites.includes(p.id))
                        .map(product => (
                          <Card key={product.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex gap-3">
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm">{product.name}</h4>
                                  <p className="text-primary font-bold">{product.price.toLocaleString()}₽</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={24} />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent animate-pulse-glow">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                          {cart.map(item => (
                            <Card key={item.id} className="overflow-hidden">
                              <CardContent className="p-4">
                                <div className="flex gap-3">
                                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{item.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      {item.discount && (
                                        <Badge variant="secondary" className="text-xs">-{item.discount}%</Badge>
                                      )}
                                      <p className="text-primary font-bold">
                                        {(item.discount
                                          ? item.price * (1 - item.discount / 100)
                                          : item.price
                                        ).toLocaleString()}₽
                                      </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Количество: {item.quantity}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Промокод"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="flex-1"
                            />
                            <Button onClick={applyPromoCode} variant="secondary">
                              Применить
                            </Button>
                          </div>

                          {appliedPromo && (
                            <div className="bg-secondary/20 p-3 rounded-lg animate-scale-in">
                              <p className="text-sm font-semibold text-secondary">
                                🎉 Промокод {appliedPromo.code} активирован!
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Скидка {appliedPromo.discount}%
                              </p>
                            </div>
                          )}

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Сумма:</span>
                              <span>{subtotal.toLocaleString()}₽</span>
                            </div>
                            {promoDiscount > 0 && (
                              <div className="flex justify-between text-secondary">
                                <span>Скидка по промокоду:</span>
                                <span>-{promoDiscount.toLocaleString()}₽</span>
                              </div>
                            )}
                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                              <span>Итого:</span>
                              <span className="text-primary">{total.toLocaleString()}₽</span>
                            </div>
                          </div>

                          <Button className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity" size="lg">
                            Оформить заказ
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Button variant="ghost" size="icon">
                <Icon name="User" size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-secondary to-accent p-12 text-white animate-fade-in">
          <div className="relative z-10">
            <h2 className="text-5xl font-bold mb-4">Мега распродажа! 🔥</h2>
            <p className="text-xl mb-6 opacity-90">Скидки до 30% на все категории</p>
            <div className="flex gap-4 flex-wrap">
              {promoCodes.map(promo => (
                <Badge key={promo.code} variant="secondary" className="text-base px-4 py-2 bg-white/90 text-primary hover:bg-white cursor-pointer">
                  {promo.code} -{promo.discount}%
                </Badge>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        <Tabs defaultValue="Все" className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1">
            {categories.map(category => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setSelectedCategory(category)}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in border-2 hover:border-primary/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.discount && (
                        <Badge className="absolute top-4 left-4 bg-accent text-white animate-pulse-glow">
                          -{product.discount}%
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Icon
                          name="Heart"
                          size={20}
                          className={favorites.includes(product.id) ? 'fill-secondary text-secondary' : ''}
                        />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">{product.category}</Badge>
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={16} className="fill-accent text-accent" />
                        <span className="font-semibold">{product.rating}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">({product.reviews} отзывов)</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      {product.discount ? (
                        <>
                          <span className="text-2xl font-bold text-primary">
                            {(product.price * (1 - product.discount / 100)).toLocaleString()}₽
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.price.toLocaleString()}₽
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {product.price.toLocaleString()}₽
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                      onClick={() => addToCart(product)}
                    >
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-muted/50 border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Маркетплейс
              </h3>
              <p className="text-sm text-muted-foreground">
                Современный маркетплейс с лучшими предложениями
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Покупателям</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Как сделать заказ</li>
                <li>Способы оплаты</li>
                <li>Доставка</li>
                <li>Возврат товара</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Продавцам</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Начать продавать</li>
                <li>Условия продажи</li>
                <li>Комиссии</li>
                <li>Поддержка</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>8 (800) 555-35-35</li>
                <li>support@nova.market</li>
                <li>Москва, ул. Примерная, 1</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Маркетплейс. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}