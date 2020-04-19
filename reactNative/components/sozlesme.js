import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    KeyboardAvoidingView,
    StatusBar,
    ImageBackground,
} from 'react-native';



class Sozlesme extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {

        return (
            <View><Text style={{padding:15}} >


1. Sözleşmenin Onaylanması
Kullanıcı kayıt formu doldurularak veya sosyal medya ağları üyeliği (Facebook, Twitter, Pinterest ve benzerleri) aracılığıyla www.yemeksepeti.com adresinden veya bu adres üzerinden erişilebilen web-sitelerini kapsayan siteler üzerinden Yemeksepeti.com sistemine üye olunabilir. Her Yemeksepeti.com kullanıcısı, Yemek Sepeti Elektronik İletişim Tanıtım Pazarlama Gıda Sanayi ve Ticaret Anonim Şirketi (“Yemeksepeti.com”) ile akdetmiş olduğu işbu Kullanıcı Sözleşmesi (“Sözleşme”) hükümlerine uyacağını kabul ve taahhüt eder.
2. Hizmetler
Yemeksepeti.com kullanıcılarına internet ortamında, mobil telefonlarda, akıllı TV sistemlerinde veya benzer platformlarda geliştirilebilen uygulamalardan sisteme üye işyerlerinden yemek siparişi verme imkanı ve buna ilişkin sair hizmetler sunar.
3. Yemeksepeti.com Kullanıcı Sistemi
Her Yemeksepeti.com kullanıcısı, kendisinin belirleyeceği bir “kullanıcı adı” veya e-posta adresi ile “şifre”ye sahip olur.
“Kullanıcı adı” e-posta adreslerinde olduğu gibi her üyeye özeldir ve aynı kullanıcı adı farklı üyelere verilmez.
Her kullanıcının Yemeksepeti.com üyeliği gerektiren sistemlere bağlanabilmesi için kullanıcı adını veya kayıtlı e-posta adresi ile şifresini girmesi gereklidir. Bu işlem Yemeksepeti.com sistemine giriş yapmak şeklinde tanımlanmıştır. Kullanıcılar, diledikleri takdirde ilgili kullanıcı sözleşmelerini onaylamak kaydıyla Yemeksepeti.com sistemine giriş yaptıkları kullanıcı adı veya e-posta adresi ve şifre ile Yemeksepeti.com sistemine dahil diğer sitelere (Papyon.com gibi) de giriş yapabilirler.
“Şifre” sadece ilgili kullanıcının bilgisi dâhilindedir. Kullanıcı şifresi unutulduğu takdirde Yemeksepeti.com, talep üzerine kullanıcının Yemeksepeti.com sisteminde kayıtlı e-posta adresine yeni şifre oluşturabilmek için bir bağlantı gönderecektir. Şifre'nin belirlenmesi ve korunması tamamıyla kullanıcının kendi sorumluluğundadır ve Yemeksepeti.com şifre kullanımından doğacak problemlerden veya oluşabilecek zararlardan kesinlikle sorumlu değildir.
Yemeksepeti.com kullanıcılarını Yemeksepeti.com’da kayıtlı adreslerinin bulunduğu bölgelerdeki ve sair şekilde yararlanabilecekleri promosyonlar ile Yemeksepeti.com sistemi dahilindeki yeni hizmet veya projelerden e-posta yolu ile haberdar edebilecektir. Ayrıca Yemeksepeti.com kullanıcılarına sosyal medya kanalları dahil olmak üzere kullanıcıların Yemeksepeti.com sistemi ile paylaştıkları her türlü iletişim kanalı üzerinden ulaşabilir ve çeşitli promosyon, kampanya ve benzer bilgileri paylaşabilecektir.
Kullanıcıların belirlemiş oldukları Yemeksepeti.com sisteminde kayıtlı isim, adres ve telefon numarası, siparişin daha çabuk ve doğru teslimi amacıyla siparişi teslim eden üye işyeri ile paylaşılacaktır.
Yemeksepeti.com, sisteminde kayıtlı isim, adres ve telefon numarasının siparişi teslim eden üye işyeri ile paylaşılmasından dolayı kullanıcı ve üye işyeri arasında ortaya çıkabilecek her türlü problemden veya oluşabilecek zarardan kesinlikle sorumlu değildir.
Yemeksepeti.com sisteminin kullanılması ile oluşacak data ve verilerin tüm fikri haklarına sahiptir. Yemeksepeti.com, söz konusu bilgilerle kullanıcı üyelik bilgilerini açıklamadan demografik bilgiler içeren raporlar düzenleyebilir veya bu tarz bilgileri veya raporları kendisi kullanabilir ve bu rapor ve/veya istatistikleri iş ortakları ile üçüncü kişilerle bedelli veya bedelsiz paylaşabilir. Bu işlemler Yemeksepeti.com Gizlilik Politikası hükümlerine aykırılık teşkil etmez.
4. Kullanıcının Yükümlülükleri
Kullanıcı, Yemeksepeti.com hizmetlerinden yararlandığı sırada,
Kullanıcı kayıt formunda yer alan bilgilerin doğru olduğunu ve ve Yemeksepeti.com’da oluşturulmuş her bir Kullanıcı adı için yalnızca bir adet e-posta tanımlanabileceğini, tanımlanan e-posta adresinin değiştirilemeyeceğini , yeni bir e-posta adresinin ancak Yemeksepeti.com üzerinde yeni bir kullanıcı oluşturulması halinde tanımlanılabileceğini; bu bilgilerin gerekli olduğu durumlarda bilginin hatalı veya noksan olmasından (şifre unutma gibi) doğacak kendisinin ya da üçüncü kişilerin zararlarından dolayı sorumluluğun kendisine ait olduğunu, bu hallerde Yemeksepeti.com üyeliğinin sona erebileceğini;
“Kullanıcı adı” veya kayıtlı e-posta adresiyle yapacağı her türlü işlemden bizzat kendisinin sorumlu olduğunu;
Yemeksepeti.com tarafından verilen hizmetlerin ve yazılımların telif hakkının Yemeksepeti.com'a ait olduğunu, bu yazılımları hiçbir şekilde çoğaltıp, dağıtmayacağını;
Yemeksepeti.com hizmetlerini kullandığında ileri sürdüğü şahsi fikir, düşünce, ifade, Yemeksepeti.com ortamına eklediği dosyaların, gönderdiği kişisel bilgilerinin sorumluluğunun kendisine ait olduğunu ve üye işyeri ile kullanıcı arasında oluşabilecek ihtilaflar dahil ancak bunlarla sınırlı olmamak üzere Yemeksepeti.com'un bu dosyalardan dolayı hiçbir şekilde sorumlu tutulamayacağını, Yemeksepeti.com’un bu görüş ve düşünceleri yayımlayıp, yayımlamamakta serbest olduğunu ayrıca bu görüş ve yorumları moderatörler aracılığıyla düzenleyip, imla hatalarını düzeltme hakkı bulunduğunu;
Yemeksepeti.com tarafından sağlanan hizmetlerde bazı hallerde 18 yaşından büyüklere ait içeriğin yer alabileceğini, bu içeriğin usule aykırı şekilde görüntülenmesi sebebiyle Yemeksepeti.com'un sorumlu olmayacağını;
Yemeksepeti.com servislerinin kullanımı sırasında kaybolacak ve/veya eksik alınacak, yanlış adrese iletilecek bilgi mesaj ve dosyalardan Yemeksepeti.com'un sorumlu olmayacağını;
Yemeksepeti.com' da sunulan hizmetlere Yemeksepeti.com tarafından belirlenen şekil dışında ve/veya yetkisiz şekilde ulaşmamayı ve yazılımı hiçbir şekilde değiştirmemeyi, değiştirilmiş olduğu belli olanları kullanmamayı ve anılan kurallara uymadığı durumlarda Yemeksepeti.com'un uğrayabileceği tüm maddi ve manevi zararı karşılamayı;
Tütün Mamulleri ve Alkollü İçkilerin Satışına ve Sunumuna İlişkin Usul ve Esaslar Hakkında Yönetmelik ve ilgili mevzuat uyarınca Yemeksepeti.com üzerinden tütün mamulleri ve alkollü içecek satışı kati suretle yapılmadığını, Yemeksepeti.com vasıtasıyla tütün mamulleri ve alkollü içecek temin etmemeyi ve üye işyerlerine bu konuda talepte bulunmamayı, aksi yöndeki işlemlerin üyeliğin iptali ve işbu Sözleşme’nin feshi ile sonuçlanabileceğini;
Kullanıcı verilerinin yetkisiz kişilerce okunmasından veya kullanılmasından dolayı gelebilecek zararlardan ötürü Yemeksepeti.com'un sorumlu tututalamayacağını;
Kullanıcı paylaşımlarının üçüncü kişiler tarafından izinsiz şekilde kullanılmasından, paylaşılmasından veya yayınlanmasından dolayı gelebilecek zararlardan Yemeksepeti.com’un sorumlu olmayacağını;
Tehdit edici, ahlak dışı, ırkçı, Türkiye Cumhuriyeti kanunlarına, uluslararası anlaşmalara aykırı, politik mesajlar içeren, 3. kişilerin fikri veya sınai mülkiyet haklarını ihlal eder nitelikte kullanıcı adı, fotoğraf ve rumuz kullanmamayı; mesaj veya yorum göndermemeyi;
Ortama eklenecek kullanıcı adları, fotoğraflar, yazışmalar, konu başlıkları ve rumuzların genel ahlak, görgü ve hukuk kurallarına uygun olmasını; politik mesajlar içermemesini; ve söz konusu ibareler, yazışmalar ve fotoğraflar ile ilgili tüm yayımlama, işleme ve çoğaltma, yayma, temsil, işaret, ses ve/veya görüntü nakline yarayan araçlarla umuma iletim, üçüncü kişilere devir ve temlik hakları dâhil olmak üzere 5846 sayılı ve 5.12.1951 tarihli Fikir ve Sanat Eserleri Kanunu’nda sayılan tüm mali hakların Yemeksepeti.com’a devredildiğini;
Diğer kullanıcıları taciz ve tehdit etmemeyi;
Diğer kullanıcıların Yemeksepeti.com sistemini kullanmasını olumsuz etkileyecek şekilde davranmamayı;
Yemeksepeti.com sistemi veya ona bağlı olarak geliştirilen sistem ve uygulamalarda yer alan hizmetleri kötüye kullanmayacağını ve bu sistemi kullanan diğer kullanıcıların haklarını ihlal eden nitelikte veya zarar veren hiçbir davranışta bulunmayacağını ve söz konusu kötüye kullanım neticesinde Yemeksepeti’nin veya ilgili kullanıcının uğrayacağı tüm zararlardan sorumluluğun tamamen kendisine ait olduğunu ve böyle bir kullanımın tespit edilmesi halinde Yemek Sepeti’nin bu kullanıcının ilgili hizmetteki hesabını ya da hesabının kullanıcı adı, profil fotoğrafı ve benzeri kısımlarını kapatma veya limitleme veya Yemeksepeti üyeliğini sona erdirme hakkının bulunduğunu;
Kişi veya kurumların isimlerini lekeleyici, çiğneyici, ahlaka aykırı, yakışıksız veya kanun dışı materyal veya bilgiler yayımlamamayı, basıp çoğaltmamayı, dağıtmamayı;
Reklam yapmamayı, herhangi bir mal veya hizmet satmamayı veya satılmasına yönelik teklifte bulunmamayı, anket, yarışma veya zincir mektup faaliyetlerinde bulunmamayı;
Diğer kullanıcıların bilgisayarındaki bilgilere veya yazılıma zarar verecek bilgi veya programlar göndermemeyi;
Yemeksepeti.com hizmetleri kullanarak elde edilen herhangi bir kayıt veya elde edilmiş malzemelerin tamamen kullanıcının rızası dâhilinde olduğunu, kendi bilgisayarında yaratacağı arızalar, bilgi kaybı ve diğer kayıpların sorumluluğunun tamamem kendisine ait olduğunu, Yemeksepeti.com sisteminin kullanımından dolayı uğrayabileceği zararlardan dolayı Yemeksepeti.com'dan tazminat talep etmemeyi;
Yemeksepeti.com'dan izin almadan Yemeksepeti.com servislerini ticari veya reklam amacıyla kullanmamayı;
Yemeksepeti.com'un, dilediği zaman veya sürekli olarak tüm sistemi izleyebileceğini;
Kurallara aykırı davrandığı takdirde Yemeksepeti.com'un gerekli müdahalelerde bulunma ve kullanıcıyı hizmet dışına çıkarma ve üyeliğine son verme hakkına sahip olduğunu,
Yemeksepeti.com'un, kendi sistemini ticari amaçla kullanabileceğini;
Kanunlara göre iletilmesi yasak olan bilgileri iletmemeyi ve zincir posta (chain mail), yazılım virüsü (vb.) gibi gönderilme yetkisi olmayan verileri paylaşmamayı;
Başkalarına ait kişisel bilgileri kayıt etmemeyi, yaymamayı, kötüye kullanmamayı;
Online Ödeme Yöntemi ile ödeme yapılmadığı durumda sipariş teslimi sırasında hizmetin daha önceden kendilerine bildirilmiş olan ücretini seçilen ödeme aracıyla ödemek durumunda olduğunu aksi takdirde ürünün kendilerine teslim edilmeyebileceğini;
Yemeksepeti.com sisteminde çerez (cookie/tanımlama bilgileri) kullanıldığını, çerezlerin bir internet sitesinin kullanıcının bilgisayarındaki sabit diskte çerez dosyasına aktardığı bilgi parçaları olduğunu, bunların kullanıcıların Yemeksepeti.com’da gezinmesine olanak sağladığını ve gerektiğinde siteye erişen kullanıcıların ihtiyaçlarına uygun içeriklerin hazırlanmasına yardımcı olduğunu beyan, taahhüt ve kabul eder.
5. Yemeksepeti.com'a Tanınan Yetkiler
Yemeksepeti.com herhangi bir zamanda sistemin çalışmasını geçici bir süre askıya alabilir veya tamamen durdurabilir. Yemeksepeti.com güvenliği şüphesi doğuran kullanıcı işlemlerinden dolayı ilgili kullanıcıların Online Ödeme Yöntemi aracılığı ile ödeme yapma imkânını geçici bir süre askıya alabilir veya tamamen durdurabilir.Sistemin veya Online Ödeme Yöntemi kullanımının geçici bir süre askıya alınması veya tamamen durdurulmasından dolayı Yemeksepeti.com’un kullanıcılarına veya üçüncü kişilere karşı hiçbir sorumluluğu olmayacaktır.Kullanıcı adı veya e-posta ile şifre Yemeksepeti.com tarafından sunulan başvuru alanlarının doldurulmasından sonra görüntülenecek ve onaylanacaktır. Yemeksepeti.com kullanıcı kayıt formunu eksiksiz doldurmuş üyelerin veya Yemeksepeti.com sistemine giriş yapan kullanıcıların yeni bir şifreye sahip olmalarını veya şifrelerini kullanmalarını münhasıran süresiz olarak engelleyebilecektir.Yemeksepeti.com, hizmetlerinin zamanında, güvenli ve hatasız olarak sunulması, hizmet kullanımından elde edilen sonuçların doğru ve güvenilir olması, hizmet kalitesinin beklentilere cevap vermesi için gerekli özeni gösterecektir ancak bunları taahhüt etmemektedir.Yemeksepeti.com kullanıcıların sistemden yararlanmaları sırasında ortamda bulunduracakları dosyaların, mesajların bazılarını veya tamamını uygun göreceği periyotlarla yedekleme ve silme yetkisine sahiptir. Yedekleme ve silme işlemlerinden dolayı Yemeksepeti.com sorumlu tutulmayacaktır.Yemeksepeti.com kendi ürettiği ve/veya dışardan satın aldığı bilgi, belge, yazılım, tasarım, grafik vb. eserlerin mülkiyet ve mülkiyetten doğan telif haklarına sahiptir.Yemeksepeti.com sistemindeki satışlar, üye işyeri menülerinin sipariş anındaki mevcudiyetiyle sınırlıdır. Yemeksepeti.com ilgili üye işyerinde bulunmayan ürünlerin kullanıcıya teslimini sağlayamayabilir. Ürünlerin Yemeksepeti.com sisteminde teşhir edilmesi bunların stokta bulunduğu anlamına gelmemektedir.Yemeksepeti.com kullanıcılarının ürettiği ve yayınlanmak üzere kendi iradesiyle sisteme yüklediği (örneğin kullanıcı resimleri, panoya eklediği mesaj, şiir, haber, dosya gibi) bilgi, belge, yazılım, tasarım, grafik vb. eserlerin her türlü yazılı ve görsel mecrada yayınlanma, işleme, sosyal medya ağlarında paylaşma ve/veya Yemeksepeti.com sistemi içinde Yemeksepeti.com tarafından uygun görülecek başka bir adrese taşıma veya kendi takdirinde olmak üzere internet sitesinden kaldırma haklarına sahiptir. Yayınlanan bu bilgilerin başka kullanıcılar tarafından kopyalanması, işlenmesi ve/veya yayınlanması ihtimal dâhilindedir. Bu hallerde kullanıcı, Yemeksepeti.com'dan hiçbir telif ücreti talep etmeyecektir.Yemeksepeti.com sisteminde satışa sunulan ürünlerin fiyat ve ürün özellik bilgilerini değiştirme yükümlülüğü Yemeksepeti.com sistemindeki üye işyerlerine aittir. Fiyat ve ürün özellik bilgilerinde hata oluştuğu takdirde Yemeksepeti.com kullanıcıları bilgilendirerek, bu hatayı düzeltecek şekilde ürün teslimatı yapabilir veya siparişi iptal edebilir.Yemeksepeti.com sisteminde satışa sunulan ürünlerin içeriğine dair doğru ve dürüst açıklama yapılmasına dair Yemeksepeti.com gerekli özeni gösterecektir ancak üye işyerlerinin sipariş içeriklerine dair yaptıkları eksik ve/veya hatalı açıklamalardan dolayı oluşacak problemlerden veya zararlardan Yemeksepeti.com sorumlu değildir.Yemeksepeti.com, kullanıcının Yemeksepeti.com sistemi dışındaki web-sitelerine geçişini sağlayabilir. Bu takdirde kullanıcı geçiş yapacağı sitelerin içeriğinden Yemeksepeti.com'un sorumlu olmadığını peşinen kabul eder.Yemeksepeti.com kullanıcı üyeliği gerektirmeyen hizmetleri zaman içinde üyelik gerektiren bir hale dönüştürülebilir, ilave hizmetler açabilir, bazı hizmetlerini kısmen veya tamamen değiştirebilir veya ücretli hale dönüştürebilir. Bu durumda kullanıcının Sözleşme’yi feshederek, üyelikten ayrılma hakkı saklıdır.Yemeksepeti.com, ileride doğacak teknik zaruretler ve mevzuata uyum amacıyla kullanıcıların aleyhine olmamak kaydıyla işbu Sözleşme’nin uygulamasında değişiklikler yapabilir, mevcut maddelerini değiştirebilir veya yeni maddeler ilave edebilir.Yemeksepeti.com üye restoranların sağladığı içerikten sorumlu değildir.
6. Kullanım Amacı
Kullanıcılar, Yemeksepeti.com sistemi üzerinde verilen tüm siparişlerin, yapılan tüm alışverişlerin kişisel kullanım amaçlı olduğunu, bunların tekrar satış amaçlı olmadığını kabul ederler.
7. Ödeme
Yemeksepeti.com kullanıcıları Yemeksepeti.com sisteminden verdikleri siparişin ücretini, Yemeksepeti.com sisteminde ilgili üye işyerinin sunduğu seçenekler arasından sipariş verirken seçtikleri şekilde teslim esnasında ödeyebilir. Kullanıcılar ayrıca Online Ödeme Yöntemi kullanarak banka kartı, kredi kartı veya benzer bir ödeme aracı ile diğer ödeme sistemleri (örneğin PayPal) vasıtasıyla anında online ödeme de yapabileceklerdir. Online Ödeme Yöntemi seçeneği kullanılarak yapılan ödemelerde, kartın hamili haricinde bir başkası tarafından hukuka aykırı şekilde kullanılması halinde 23.02.2006 tarihli 5464 sayılı Banka Kartları ve Kredi Kartları Kanunu ve 10.03.2007 tarihli ve 26458 sayılı Resmi Gazete’de yayımlanan Banka Kartları ve Kredi Kartları Hakkında Yönetmelik hükümlerine göre işlem yapılır.Online Ödeme Yöntemi ile ödemesi yapılmış siparişlerde, sipariş karşılığı fiş/fatura Yemeksepeti.com tarafından değil siparişi alan restoran tarafından düzenlenir. Online Ödeme Yöntemi kullanılarak verilen siparişlerde, Yemeksepeti.com, sipariş edilen ürünlere ilişkin bedelleri restoranların nam ve hesabına Kullanıcılardan tahsil etmek için restoranlar tarafından münhasır olarak yetkilendirilmiştir. Kullanıcılar, Online Ödeme Yöntemi kullanılarak verilen siparişlerde ödemeyi Yemeksepeti.com’a yapmakla ödeme yükümlülüklerini ifa etmiş olmaktadır. Vale Hizmeti kullanılarak online ödeme yöntemi, kapıda kredi kartı/banka kartıyla ödeme yöntemi, kapıda nakit ödeme yöntemi dahil fakat bunlarla sınırlı olmamak üzere her türlü ödeme yöntemiyle gerçekleşen siparişlerde, Yemeksepeti.com, sipariş edilen ürünlere ilişkin bedelleri restoranların nam ve hesabına Kullanıcılardan tahsil etmek için münhasır olarak yetkilendirilmiştir. Kullanıcılar, vale hizmeti kullanılarak verilen siparişlerde ödemeyi online ödeme yöntemi, kapıda kredi kartı/banka kartıyla ödeme yöntemi, kapıda nakit ödeme yöntemi dahil fakat bunlarla sınırlı olmamak üzere her türlü ödeme yöntemiyle yapmakla, restorana ve Yemeksepeti.com'a karşı ödeme yükümlülüklerini ifa etmiş olmaktadırlar.
8. Kişisel Veri
Kullanıcı Yemeksepeti.com’a üye olurken Kullanıcı Sözleşmesini onaylamak ve üyelik sonrası Web Sitesi içerisindeki hareketleri esnasında, veri sorumlusu Yemeksepeti ile paylaştıkları ad, soyad, elektronik posta adresi, sipariş adres/adresleri, telefon numarası gibi kişisel verilerinin (“Kişisel Veri/ler”) Kişisel Verilerin Korunması Hakkındaki Kanun’da belirlenmiş olan esaslar çerçevesinde işlenmesine, 3. kişilere ve yurtdışına aktarılmasına açıkça rıza gösterdiğini kabul ve beyan eder. Kişisel Veriler’in işlenmesi, 3. kişilere ve yurtdışına aktarılması Kullanıcı ile Yemeksepeti.com arasında kurulan hukuki ilişkiye dayanmaktadır. Kişisel Veriler Yemeksepeti.com ve Yemeksepeti.com iştirakleri tarafından işbu sözleşmesel ilişki kapsamında ve Yemeksepeti.com ve iştiraklerinin sözleşmesel ilişkisi bulunan iş ortakları tarafından pazarlama, analiz, istatistik gibi amaçlarla işlenebilir, 3. kişilere ve yurtdışına aktarılabilir veya anonimleştirilerek kullanılabilir. Buna ek olarak Kullanıcılar Kişisel Verileri dışındaki sipariş bilgileri (sipariş verdikleri restoranlar, sipariş verilen ürün tipi, sipariş adedi, sipariş saati, sipariş verilen bölge gibi Web Sitesi (veya kullanılan benzeri mobil veya elektronik mecra) üzerindeki tüm davranışları, sipariş detayları gibi) ve benzeri verilerinin (“Veri/ler”) Yemeksepeti.com, Yemeksepeti.com iştirakleri ve iş ortakları tarafından kaydedilmesi, işlenmesi ve listelenmesinde ve/veya anonimleştirilerek analizlerde 3. kişilerle hizmetin daha iyi sağlanması veya çeşitli uygulamaların veya programların Yemeksepeti.com üzerinde çalıştırılabilmesi için anonim şekilde kullanılmasına açık rızalarının olduğunu kabul ve beyan ederler.
10. Ürün Teslimatı
Üye işyerleri tarafından yapılan ürün teslimatı sürecinde kullanıcı, Yemeksepeti.com sisteminde seçtiği adreste bulunamaz ise siparişi kesinlikle başka bir adrese bırakılmayacaktır. Bu durum çerçevesinde kullanıcı kendisinin bulunmadığı bir adrese sipariş vermiş olduğu için doğacak kanuni yükümlülükleri kabul etmek durumundadır.
11. Ücret İadesi
Online Ödeme Yöntemi ile ödemesi yapılmış siparişlerle sınırlı olmak üzere kullanıcıya ücret iadesi ancak
kullanıcı adresinin sipariş verilen restoranın gönderim alanı dışında olması nedeniyle siparişin zorunlu iptali;
siparişin ilgili restorana iletilememesi nedeniyle siparişin zorunlu iptali;
restoran tarafından siparişin hazırlanmadığı veya siparişin hazırlanmış olmasına rağmen restoranın iptal işlemini onaylamış olduğu hallerde kullanıcı talebi üzerine siparişin iptali;
siparişin bir kısmının veya tamamının restoranda mevcut olmaması nedeniyle siparişin kısmen veya tamamen zorunlu iptali;
Sipariş edilen üründen memnun kalınmaması nedeniyle ilgili restoran onayının alınmasının akabinde yapılan sipariş iptali; ve
Sipariş edilen ürünün teslimatının gecikmesi durumunda ilgili restoran onayı üzerine yapılan iptal durumunda yapılacaktır. İptale konu siparişe ilişkin ilgili restoran bir fiş veya fatura düzenlemiş ve bu kullanıcıya teslim edilmiş ise ilgili restoran görevlisine iadesi gerekmektedir.

Yemeksepeti.com, yalnızca kullanıcıdan kaynaklanan sebeplerden dolayı (örneğin kullanıcının evde olmaması, yanlış adres bilgisi vermesi, siparişi teslim almaması gibi) ücret iadesi yapmama hakkını saklı tutar.
Online Ödeme Yöntemi dışındaki ödeme vasıtaları ile ödemesi yapılmış siparişlerde ücret iadesi, Yemeksepeti.com’un bünyesinde bulundurduğu üye işyerleri tarafından doğrudan yapılmaktadır. Yemeksepeti.com, üye işyerleri tarafından yapılacak ürün iadesi koşullarına ilişkin olarak doğabilecek anlaşmazlıklarda hiçbir sorumluluk kabul etmemektedir.
12. Bilgilerin Saklanması ve İspat Yükümlülüğü:
Yemeksepeti.com sisteminde kayıtlı kullanıcı bilgileri, siparişleri, yorum/değerlendirmeleri vb. Yemeksepeti.com Gizlilik Politikası’na tabi olacak şekilde en az üç (3) yıl boyunca saklanır. İşbu Sözleşme’nin ifasından doğacak her türlü uyuşmazlıkta Yemeksepeti.com sisteminde saklanan veriler ile kullanıcı kayıtları bağlayıcı ve kesin delil teşkil eder. İşbu Sözleşme Türkiye Cumhuriyeti kanunlarına tabidir. Sözleşme’nin ifasından doğabilecek her türlü uyuşmazlığın çözümünde İstanbul Merkez Mahkeme ve İcra Müdürlükleri yetkilidir.
14. Yürürlük
İşbu Sözleşme taraflar arasında kullanıcının, kullanıcı kayıt formunu doldurmasından itibaren süresiz olarak yürürlüğe girer.
15. Fesih
Taraflar işbu Sözleşme’yi diledikleri zaman sona erdirebileceklerdir. Sözleşme’nin feshi anında tarafların birbirlerinden olan alacak hakları etkilenmez.



            </Text></View>
        )


    }

}

export default Sozlesme;