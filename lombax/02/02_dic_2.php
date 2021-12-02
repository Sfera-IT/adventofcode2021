<?php

// 10:26 - 10:31


class Submarine {
    public $hPos;
    public $depth;
    public $aim;

    public function __construct()
    {
        $this->hPos = 0;
        $this->depth = 0;
        $this->aim = 0;
    }

    function up($v) {
        //$this->depth -= $v;
        $this->aim -= $v;
    }

    function down($v) {
        //$this->depth += $v;
        $this->aim += $v;

    }

    function forward($v) {
        $this->hPos += $v;
        $this->depth += $this->aim*$v;
    }

}




$path = file_get_contents('./02_dic.txt');

$pathElements = explode("\n", $path);

$submarine = new Submarine();
foreach ($pathElements as $movement) {
    $m = explode(" ", $movement);
    $direction = $m[0];
    $distance = $m[1];

    $submarine->$direction($distance);
}

var_dump($submarine->hPos*$submarine->depth);




