<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('nv_inscrire', function (Blueprint $table) {
        $table->id();
        $table->string('nom_i',50)->nullable();
        $table->string('prenom_i',50)->nullable();
        $table->string('num_tele',20)->nullable();
        $table->string('nom_parents',50)->nullable();
        $table->string('telephone_parent',20)->nullable();
        $table->string('email')->unique();
        $table->foreignId('id_filiere')->constrained('filieres');
        $table->string('password');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nv_inscrire');
    }
};
