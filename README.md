## KIẾN TRÚC WEB ADMIN – BÃI ĐỖ XE KHÔNG BARRIER (CHUẨN TRIỂN KHAI THỰC TẾ)

Hệ thống Web Admin được thiết kế làm **trung tâm nghiệp vụ duy nhất** cho bãi đỗ xe không barrier, chịu trách nhiệm quản lý toàn bộ vòng đời gửi xe từ lúc xe đi vào, trong thời gian đỗ, cho đến khi xe rời bãi và hoàn tất (hoặc không hoàn tất) thanh toán. Hệ thống **không phụ thuộc vào barrier vật lý**, không yêu cầu khách phải thao tác trên mobile app, và vận hành dựa hoàn toàn trên dữ liệu nhận diện từ AI kết hợp với quy trình nghiệp vụ chặt chẽ ở backend.

Khi xe đi vào bãi, camera kết hợp AI (chạy trên Jetson Nano hoặc thiết bị edge tương đương) thực hiện nhận diện biển số và loại xe, đồng thời ghi nhận thời gian vào. Dữ liệu này được gửi về backend NodeJS dưới dạng một sự kiện “xe vào”. Backend tiếp nhận sự kiện, tạo một bản ghi **parking session** mới với trạng thái `IN_PARKING`, lưu các thông tin bắt buộc gồm biển số, loại xe, thời gian vào, nguồn camera và (nếu có) ảnh bằng chứng. Ngay sau đó, Web Admin ReactJS hiển thị phiên gửi xe này trong danh sách “xe đang gửi”, cho phép nhân viên bãi giám sát theo thời gian thực số lượng xe trong bãi, thời gian gửi của từng xe và loại xe tương ứng. Tại giai đoạn này, hệ thống có thể hiển thị phí tạm tính để phục vụ theo dõi nội bộ, nhưng chưa phát sinh thanh toán.

Khi xe rời bãi, AI gửi sự kiện “xe ra” với biển số và thời gian ra. Backend tìm đúng parking session đang ở trạng thái `IN_PARKING` tương ứng với biển số đó, ghi nhận thời gian ra và chuyển trạng thái phiên sang `WAIT_PAYMENT`. Tại thời điểm này, backend thực hiện toàn bộ logic tính phí một cách tập trung và độc lập với frontend: hệ thống tính thời gian gửi thực tế bằng cách lấy chênh lệch giữa thời gian ra và thời gian vào, quy đổi sang số giờ gửi, sau đó áp bảng giá theo loại xe. Mỗi loại xe có cấu hình giá riêng (ví dụ: giá cho 2 giờ đầu), và cứ mỗi 2 giờ gửi thêm thì cộng thêm 5.000 đồng. Công thức tính phí được thực hiện hoàn toàn ở backend nhằm đảm bảo tính nhất quán, tránh gian lận và không phụ thuộc vào client. Kết quả tính toán bao gồm tổng thời gian gửi và số tiền phải thanh toán được trả về Web Admin để hiển thị minh bạch cho nhân viên và khách hàng.

Ngay sau khi xác định số tiền phải trả, backend **chủ động tạo mã QR thanh toán SePay** bằng cách gọi API của SePay với các thông tin bắt buộc: số tiền cần thanh toán, nội dung chuyển khoản (ví dụ gắn với biển số xe), mã giao dịch nội bộ và thời hạn hiệu lực của QR. SePay trả về dữ liệu QR (dưới dạng URL hoặc ảnh), backend lưu thông tin này vào bảng `payment` và liên kết chặt chẽ với parking session tương ứng. Web Admin ngay lập tức hiển thị mã QR này trên giao diện để khách hàng quét và thanh toán tại chỗ. Trong suốt thời gian chờ thanh toán, parking session vẫn ở trạng thái `WAIT_PAYMENT`, và Web Admin thể hiện rõ đây là phiên “chưa thanh toán”.

Khi khách hàng thực hiện thanh toán thành công, SePay gửi callback (webhook) về backend NodeJS. Backend xác thực callback (đúng mã giao dịch, đúng số tiền, đúng chữ ký bảo mật), sau đó cập nhật trạng thái thanh toán của parking session sang `PAID`, đồng thời lưu thời điểm thanh toán và thông tin giao dịch làm bằng chứng. Web Admin nhận cập nhật gần như realtime (thông qua WebSocket hoặc cơ chế polling) và hiển thị trạng thái “đã thanh toán”, cho phép in hóa đơn hoặc xuất dữ liệu giao dịch nếu cần. Tại đây, phiên gửi xe được xem là hoàn tất về mặt nghiệp vụ.

Trong trường hợp xe rời bãi nhưng **không thanh toán**, hệ thống **không chặn luồng vận hành**. Parking session vẫn được đóng bình thường, phí được tính, QR đã được tạo, nhưng nếu sau một khoảng thời gian cấu hình trước (ví dụ 10–15 phút) không nhận được callback thanh toán từ SePay, phiên gửi xe sẽ được chuyển sang trạng thái `UNPAID` hoặc `DEBT`. Toàn bộ dữ liệu liên quan (biển số, thời gian vào/ra, loại xe, số tiền, ảnh bằng chứng) được lưu lại để phục vụ truy thu. Trên Web Admin, các phiên nợ này được hiển thị rõ ràng và gắn cờ cảnh báo. Khi biển số đó quay lại bãi trong tương lai, Web Admin sẽ hiển thị cảnh báo đỏ cho nhân viên để yêu cầu thanh toán khoản nợ cũ trước khi tiếp tục sử dụng dịch vụ, hoặc từ chối phục vụ theo quy định của bãi.

Về hiệu năng khi xe đông, hệ thống được thiết kế theo nguyên tắc **xử lý bất đồng bộ**: việc tính phí và tạo QR SePay được thực hiện ngay khi xe ra được nhận diện, không chờ UI và không chặn giao diện. QR chỉ được tạo một lần cho mỗi parking session, có thể cache trong Redis để Web Admin chỉ việc lấy ra hiển thị, không gọi lại API SePay nhiều lần. Với thiết kế này, ngay cả khi lưu lượng lên tới hàng trăm xe mỗi giờ, backend vẫn xử lý kịp thời, và SePay không trở thành nút cổ chai.

Tổng thể, kiến trúc Web Admin này đảm bảo rằng toàn bộ logic nghiệp vụ – từ nhận diện, quản lý phiên gửi xe, tính phí, tạo QR, xác nhận thanh toán đến xử lý nợ – đều nằm ở backend và được điều phối qua Web Admin. AI chỉ đóng vai trò cung cấp dữ liệu đầu vào, SePay chỉ là kênh thanh toán, còn Web Admin là công cụ vận hành thực tế, đủ chặt để triển khai thương mại trong môi trường **bãi đỗ xe không barrier**, nơi việc quản lý và truy thu quan trọng hơn việc “chặn xe” bằng phần cứng.

OK. Viết lại **ngắn – đúng trọng tâm – chuẩn tài liệu triển khai**, bỏ hết văn vẻ.

---

## KIẾN TRÚC WEB ADMIN – BÃI ĐỖ XE KHÔNG BARRIER (TÓM TẮT TRIỂN KHAI)

### 1. Vai trò hệ thống

- **Web Admin** là trung tâm nghiệp vụ duy nhất.
- Không barrier, không mobile app cho khách.
- AI chỉ nhận diện, **mọi logic nằm ở backend**.
- Thanh toán qua **QR SePay**.

---

### 2. Luồng xe vào

- Camera + AI nhận diện **biển số, loại xe, thời gian vào**.
- Gửi sự kiện `CAR_IN` về backend NodeJS.
- Backend tạo **parking session**:
  - Trạng thái: `IN_PARKING`
  - Lưu: biển số, loại xe, thời gian vào, camera, ảnh.

- Web Admin hiển thị danh sách **xe đang gửi** (realtime).

---

### 3. Luồng xe ra & tính phí

- AI gửi sự kiện `CAR_OUT`.
- Backend:
  - Tìm session `IN_PARKING`
  - Ghi nhận thời gian ra
  - Chuyển trạng thái `WAIT_PAYMENT`
  - **Tính phí tại backend**:
    - Thời gian gửi = time_out − time_in
    - Áp bảng giá theo loại xe
    - Mỗi block 2 giờ cộng thêm phí

- Web Admin hiển thị số tiền phải trả.

---

### 4. Thanh toán QR SePay

- Backend **chủ động tạo QR SePay**:
  - Số tiền
  - Nội dung (biển số)
  - Mã giao dịch nội bộ

- Lưu thông tin payment, liên kết với session.
- Web Admin hiển thị QR cho khách quét.

---

### 5. Xác nhận thanh toán

- SePay gửi **webhook callback**.
- Backend:
  - Xác thực giao dịch
  - Cập nhật session → `PAID`
  - Lưu thông tin thanh toán

- Web Admin cập nhật realtime, cho phép in/xuất hóa đơn.

---

### 6. Trường hợp không thanh toán

- Sau timeout (10–15 phút):
  - Session chuyển `UNPAID / DEBT`

- Lưu đầy đủ dữ liệu để **truy thu**.
- Khi xe quay lại:
  - Web Admin **cảnh báo nợ**
  - Yêu cầu thanh toán trước hoặc từ chối phục vụ.

---

### 7. Hiệu năng & kỹ thuật

- Xử lý **bất đồng bộ**.
- Tạo QR **1 lần / session**, cache Redis.
- Web Admin chỉ fetch, không gọi lại SePay.
- Chịu tải tốt khi xe đông.

---
