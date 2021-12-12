import Head from 'next/head'
import Link from 'next/dist/client/link';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer'
import Queries from '../../components/Checkout/ItemList';
import InfoUser from '../../components/Checkout/infoUser';
import { useRouter } from 'next/router'

const servicepage = () => {
    return (
        <div>
            <Head>
                <title>CellPhone Store</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" key="title" />
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
                {/* <!-- Bootstrap CSS --> */}
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous" />
                <link rel="stylesheet" href="./vendors/flickity.min.css" />
                {/* <!-- Optional CSS --> */}
                <link rel="stylesheet" href="./css/style.css" />
            </Head>
            <Header></Header>
            <div className="container col-12 col-lg-9" >
                <nav class="breadcrumb breadcrumb--custom my-1">
                    <div class="container px-0">
                        <Link href="/">
                            <a class="breadcrumb-item">Trang chủ</a>
                        </Link>
                        <span class="breadcrumb-item active">Dịch vụ chuyển phát</span>
                    </div>
                </nav>

                <div class="bg-white p-3">
                    <h1 className="h1"> Dịch vụ ship cod Viettel Post</h1>
                    <hr></hr>
                    <span className="font-italic" > Bạn có nhu cầu gửi hàng cho khách và muốn tìm một đơn vị thực hiện dịch vụ ship cod với các tiêu chí như đảm bảo về thời gian giao hàng, tiết kiệm chi phí vận chuyển cũng như phải đảm bảo chất lượng cho hàng hóa mang đi vận chuyển? Vậy bạn đã biết đến dịch vụ ship cod Viettel chưa? Hãy cùng tìm hiểu một vài thông tin về dịch vụ giao hàng thu tiền này nhé.</span>
                    <p></p>
                    <p></p>
                    <h2 className="h2">1. Dịch vụ giao hàng thu tiền hộ của Viettel Post</h2>
                    <img src="https://gumato.com/wp-content/uploads/2019/04/cach-ship-cod-viettel.jpg" class="img-fluid rounded mx-auto d-block"  alt="..."></img>
                    <p className="text-center">Ship cod như thế nào</p>
                    <p>
                        <span className="text-bold">
                            <b>Ship cod Viettel post </b>
                            <span>được biết đến là dịch vụ giao hàng và thu tiền hộ cũng giống như dịch vụ ship COD của các cơ sở khác nhau VNpost, Kerry Express,… Hiện nay </span>
                            <b>Viettel ship cod</b>
                            <span> áp dụng trên phạm vi toàn quốc ở cả 63 tỉnh thành với các gói chuyển phát nhanh và chuyển phát thường tiết kiệm.</span>

                        </span>
                    </p>
                    <p>
                        <span>
                            <b>Dịch vụ ship cod của viettel </b>
                            <span>
                                có cách tính phí thu hộ dựa theo các khu vực vận chuyển khác nhau, cụ thể:
                            </span>

                        </span>
                    </p>
                    <ul className="ml-4">
                        <li>
                            <span>
                                Viettel miễn phí thu hộ tiền cod đối với những đơn hàng vận chuyển trong nội thành hoặc trong cùng 1 tỉnh.
                            </span>
                        </li>
                        <li>
                            <span>
                                Đối với những đơn hàng liên tỉnh ở khu vực trung tâm phí thu hộ tiền cod của Viettel sẽ được tính bằng 0.8% giá trị của tiền cod.                            </span>
                        </li>
                        <li>
                            <span>
                                Còn đối với những đơn hàng ở khu vực liên tỉnh mà thuộc các huyện hoặc xã thì phí thu hộ sẽ cao hơn, bằng 1.4% số tiền cod.                            </span>
                        </li>
                    </ul>

                    <h2 className="h2">2. Cách ship cod viettel như thế nào?</h2>
                    <img src="	https://gumato.com/wp-content/uploads/2019/04/cach-ship-coo-viette-post.jpg" class="img-fluid rounded mx-auto d-block" alt="..."></img>
                    <p className="text-center">hướng dẫn ship cod viettel</p>
                    <blockquote class="blockquote">
                        <div class="bg-light p-3">
                            <b>Ship cod Viettel </b>
                            <span class="mb-0"> như thế nào vẫn luôn là một trong những vấn đề mà nhiều người hiện nay thắc mắc. Chúng ta có thể sử dụng dịch vụ ship của Viettel bằng cách tạo đơn hàng online hoặc mang hàng trực tiếp đến các bưu cục của Viettel. </span>
                        </div>
                    </blockquote>

                    <p>
                        <span>
                            Nếu như bạn tiến hành gửi hàng tại các bưu cục Viettel thì bạn chỉ cần mang hàng hóa đến bưu cục và nhân viên sẽ hướng dẫn chúng ta cụ thể. Còn nếu chúng ta tiến hành sử dụng
                        </span>
                        <b> Cách ship cod Viettel</b>
                        <span> qua hình thức online thì sau đây sẽ là các bước cụ thể mà chúng ta cần thực hiện:</span>
                    </p>
                    <h4 className="h4"><b> Bước 1: Tạo tài khoản</b></h4>

                    <p>
                        Để có thể tiến hành sử dụng dịch vụ ship cod Viettel chúng ta cần truy cập vào website trực tuyến của Viettel Post và tạo tài khoản. Với tài khoản này chúng ta có thể tạo đơn hàng và theo dõi quá trình vận đơn di chuyển
                    </p>
                    <h4 className="h4"><b>Bước 2: Tạo đơn hàng</b></h4>
                    <img src="https://gumato.com/wp-content/uploads/2019/04/dich-vi-ship-cod-cua-viettel.jpg" class="img-fluid rounded mx-auto d-block" alt="..."></img>
                    <p className="text-center">cách ship cod viettel post</p>
                    <p>Sau khi đã có tài khoản cá nhân chúng ta có thể vào mục vận chuyển rồi sau đó nhấp vào biểu tượng tạo đơn và tiến hành điền đầy đủ tất cả các thông tin về người gửi và người nhận như họ tên, địa chỉ, số điện thoại cũng như số tiền cần thu hộ. Cuối cùng chúng ta nhấn xác nhận.</p>
                    <h4 className="h4"><b>Bước 3: chờ lấy hàng</b></h4>

                    <p>Khi hệ thống báo đơn hàng đã được tạo, chúng ta chỉ cần sửa đổi nhân viên của Viettel đến địa chỉ của chúng ta để nhận hàng. Trong thời gian này bạn có thể đóng gói sẵn hàng hóa của mình để giao cho nhân viên vận chuyển.</p>

                    <h4 className="h4"><b> Bước 4: chờ giao hàng và nhận cod</b></h4>
                    <img src="	https://gumato.com/wp-content/uploads/2019/04/huong-dan-ship-cod-viettel.jpg" class="img-fluid rounded mx-auto d-block" alt="..."></img>
                    <p className="text-center">ship cod viettel khi nào nhận được tiền</p>

                    <p>
                        Bạn hoàn toàn có thể theo dõi được tình trạng đơn hàng của mình đang trong quá trình vận chuyển đến giai đoạn nào bằng cách kiểm tra online dựa trên mã đơn hàng đã được tạo. Khi hệ thống báo quá trình giao hàng đã hoàn tất, tiền cod mà bạn nhờ thu hộ sẽ được chuyển khoản vào tài khoản mà chúng ta đã đăng ký trên tài khoản viettel post.
                    </p>

                    <h2 className="h2">3. Những lợi thế khi sử dụng dịch vụ vận chuyển của viettel</h2>
                    <img src="	https://gumato.com/wp-content/uploads/2019/04/ship-cod-viettel-nhu-the-nao.jpg" class="img-fluid rounded mx-auto d-block" alt="..."></img>
                    <p className="text-center">Viettel post ship cod có những ưu điểm gì</p>

                    <p>
                        <span>Sử dụng dịch vụ </span>
                        <b>ship cod Viettel,</b>
                        <span> các shop online cũng đi người gửi hàng không chỉ tiết kiệm được thời gian, chi phí mà còn luôn đảm bảo dịch vụ vận chuyển an toàn.</span>

                    </p>

                    <h3 class="h3">Viettel post giúp bạn tiết kiệm thời gian</h3>
                    <p>Với tác phong chuyên nghiệp, dịch vụ giao hàng và thu hộ tiền của Viettel có thể giúp chúng ta tiết kiệm tối đa thời gian trong vấn đề tạo đơn hàng và gửi hàng. Người gửi sẽ không cần phải bước chân ra khỏi nhà mà vẫn có thể gửi được hàng đến tay người nhận nhờ dịch vụ nhận hàng tại nhà của Viettel.</p>

                    <h3 className="h3">Cước phí ưu đãi</h3>
                    <img src="https://gumato.com/wp-content/uploads/2019/04/ship-cod-viettel-2.jpg" class="img-fluid rounded mx-auto d-block" alt="..."></img>
                    <p className="text-center">ship cod viettel</p>
                    <p>Không giống như một số đơn vị tiến hành dịch vụ ship cod hiện nay luôn tính phí thu hộ tiền dù chúng ta vận chuyển khối lượng đơn hàng lớn hay nhỏ và khoảng cách vận chuyển gần hay xa. Tại Viettel post, cước phí này luôn được miễn phí đối với những đơn hàng giao trong nội tỉnh đặc biệt là nếu giao liên tỉnh thì mức phí cũng rất ưu đãi.</p>

                    <h3 className="h3">Viettel post vận chuyển an toàn</h3>
                    <p>Nhằm đảm bảo tối đa quyền lợi cho khách hàng, Viettel post luôn có các chính sách hỗ trợ người gửi trong quá trình như đảm bảo an toàn hàng hóa tuyệt đối, không để xảy ra tình trạng hàng hóa bị mất mát hay hư hỏng trong quá trình vận chuyển.</p>
                    <blockquote class="blockquote">
                        <div class="bg-light p-3">
                            <p>Bên cạnh đó, Viettel post cũng muốn khuyên bạn nên sử dụng các mẫu hộp giấy carton nhỏ để bảo đảm sự an toàn cho sản phẩm bên trong của bạn.</p>
                            <p>Còn nếu bạn vận chuyển hàng hóa nhiều thì thùng giấy carton 5 lớp là 1 lựa chọn hợp lý cho bạn.</p>
                        </div>
                    </blockquote>

                    <p>Với những thông tin trên đây, chắc chắn các vấn đề liên quan đến dịch vụ ship cod Viettel sẽ không còn là điều khiến chúng ta phải loay hoay tìm câu trả lời nữa rồi đúng không nào? Cùng với VNPost và các đơn vị vận chuyển khác, Viettel Post luôn sẵn sàng phục vụ nhu cầu gửi hàng một tất cả các đơn vị kinh doanh cũng như các shop bán hàng online.</p>





                </div>



            </div>

            <Footer></Footer>
        </div>
    )
}

export default servicepage;