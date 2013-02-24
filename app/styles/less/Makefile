DEBUG=True
LESS_FILES=./index.less
CSS_FILES=$(LESS_FILES:.less=.css)


ifeq ($(DEBUG),True)
	LESSC=lessc
else
	LESSC=lessc -x
endif

less: $(CSS_FILES)

%.css: %.less
	$(LESSC) $< > $@
clean:
	mv ./index.css ../css/style.css

watch:
	echo "Watching less files..."; \
	watchr -e "watch('less/.*\.less') { system 'make' }"

