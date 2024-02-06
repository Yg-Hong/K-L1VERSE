from kafka import KafkaConsumer, KafkaProducerimport jsonfrom .apps import BotConfig# Kafka ConfigKAFKA_BOOTSTRAP_SERVERS = 'i10a409.p.ssafy.io:9092'KAFKA_INPUT_TOPIC = 'cleanbot-input'KAFKA_BOARD_OUTPUT_TOPIC = 'cleanbot-board-output'KAFKA_CHAT_OUTPUT_TOPIC = "cleanbot-chat-output"KAFKA_COMMENT_OUTPUT_TOPIC = "cleanbot-comment-output"def consume_input_message():    consumer = KafkaConsumer(KAFKA_INPUT_TOPIC,                             bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,                             group_id="kliverse",                             value_deserializer=lambda m: json.loads(m.decode('utf-8')))    while True:        try:            messages = consumer.poll(1.0)            if messages is None:                continue            for message in consumer:                # message value and key are raw bytes -- decode if necessary!                # e.g., for unicode: `message.value.decode('utf-8')`                print("%s:%d:%d: key=%s value=%s" % (message.topic, message.partition,                                                     message.offset, message.key,                                                     message.value))                result = predict_and_generate_response(message.value.get("messageId"),                                                       message.value.get("roodId"),                                                       message.value.get("domain"),                                                       message.value.get("content"))                produce_result(result, message.value.get("domain"))        except Exception as e:            print("Kafka exception: {}".format(e))    consumer.close()def produce_result(result, domain):    producer = KafkaProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS)    if domain == "board":        producer.send(KAFKA_BOARD_OUTPUT_TOPIC, value=result.encode('utf-8'))    elif domain == "chat":        producer.send(KAFKA_CHAT_OUTPUT_TOPIC, value=result.encode('utf-8'))    elif domain == "comment":        producer.send(KAFKA_COMMENT_OUTPUT_TOPIC, value=result.encode('utf-8'))    producer.flush()    producer.close()def predict_and_generate_response(messageId, roomId, domain, input_text):    # 분석 결과    analysis_result = BotConfig.pipe(input_text)[0]    score = 0    result = ""    for analysis in analysis_result:        label = analysis['label']        temp_score = analysis['score']        # 애매한 욕설인 경우 필터링 기준 완화        if label == "악플/욕설":            temp_score -= 0.3        if score < temp_score:            score = temp_score            result = label    # JSON 응답    if result == "clean":        return json.dumps({"messageId": messageId, "roomId": roomId, "domain": domain, "result": True})    else:        return json.dumps({"messageId": messageId, "roomId": roomId, "domain": domain, "result": False})# # 비동기로 Kafka에서 메시지를 소비하고 결과를 다시 Kafka로 전송# loop = asyncio.get_event_loop()# loop.run(consume_input_message)consume_input_message()